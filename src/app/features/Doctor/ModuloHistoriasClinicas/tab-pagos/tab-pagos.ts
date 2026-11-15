// features/Doctor/ModuloHistoriasClinicas/tab-pagos/tab-pagos.ts
// ODO-40: pestaña "Pagos". Reemplaza la columna de abonos, la firma y la marca "P" de la ficha en papel.
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PagoService } from '../../../../core/services/pago';
import { TratamientoService } from '../../../../core/services/tratamiento';
import { CitaService } from '../../../../core/services/cita';
import { TratamientoDTO } from '../../../../core/models/tratamientoDTO';
import { CitaResponseDTO } from '../../../../core/models/citaDTO';
import { AbonoDTO, CuentaDTO, EstadoAbono, ResumenPagosDTO } from '../../../../core/models/pagoDTO';

interface FormCuenta {
  tratamientoId: number | null;
  descripcion: string;
  montoTotal: number | null;
  entrada: number | null;
  cuotaSugerida: number | null;
}

interface FormAbono {
  fecha: string;
  monto: number | null;
  citaId: string | null;
  observacion: string;
  estado: EstadoAbono;
}

@Component({
  selector: 'app-tab-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './tab-pagos.html',
  styleUrl: './tab-pagos.css'
})
export class TabPagos implements OnInit {
  @Input() idUsuario: string = '';

  private pagoService = inject(PagoService);
  private tratamientoService = inject(TratamientoService);
  private citaService = inject(CitaService);
  private cdr = inject(ChangeDetectorRef);

  resumen: ResumenPagosDTO | null = null;
  tratamientos: TratamientoDTO[] = [];
  citas: CitaResponseDTO[] = [];

  cargando = true;
  guardando = false;
  mensajeError = '';
  mensajeExito = '';

  cuentaAbiertaId: string | null = null;
  mostrarFormCuenta = false;
  formCuenta: FormCuenta = this.cuentaVacia();
  formAbono: FormAbono = this.abonoVacio(null);

  ngOnInit() {
    if (!this.idUsuario) {
      return;
    }
    this.cargarResumen();
    this.tratamientoService.listarTodos().subscribe({
      next: (data) => { this.tratamientos = data; this.cdr.detectChanges(); },
      error: () => { this.tratamientos = []; }
    });
    this.citaService.obtenerCitasPorPaciente(this.idUsuario).subscribe({
      next: (data) => {
        this.citas = data.filter(c => c.estado !== 'CANCELADA')
          .sort((a, b) => b.fechaHoraInicio.localeCompare(a.fechaHoraInicio));
        this.cdr.detectChanges();
      },
      error: () => { this.citas = []; }
    });
  }

  cargarResumen() {
    this.cargando = true;
    this.pagoService.obtenerResumenPaciente(this.idUsuario).subscribe({
      next: (data) => {
        this.resumen = data;
        if (!this.cuentaAbiertaId && data.cuentas.length) {
          const activa = data.cuentas.find(c => c.estado === 'ACTIVA');
          this.cuentaAbiertaId = (activa ?? data.cuentas[0]).id;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.mostrarError(err, 'No se pudo cargar la información de pagos.');
      }
    });
  }

  // ---------- Cuentas ----------

  abrirFormCuenta() {
    this.formCuenta = this.cuentaVacia();
    this.mostrarFormCuenta = true;
    this.limpiarMensajes();
  }

  alElegirTratamiento() {
    const t = this.tratamientos.find(x => x.id === Number(this.formCuenta.tratamientoId));
    if (!t) {
      return;
    }
    if (!this.formCuenta.descripcion.trim()) {
      this.formCuenta.descripcion = t.nombre;
    }
    // El precio base del catálogo solo se sugiere; el monto acordado lo escribe el doctor.
    if (!this.formCuenta.montoTotal && t.precioBase) {
      this.formCuenta.montoTotal = Number(t.precioBase);
    }
  }

  guardarCuenta() {
    const f = this.formCuenta;
    if (!f.descripcion.trim() || !f.montoTotal || f.montoTotal <= 0) {
      this.mensajeError = 'Ingrese la descripción y un monto total mayor que cero.';
      return;
    }
    this.guardando = true;
    this.limpiarMensajes();
    this.pagoService.crearCuenta({
      pacienteId: this.idUsuario,
      tratamientoId: f.tratamientoId ? Number(f.tratamientoId) : null,
      descripcion: f.descripcion.trim(),
      montoTotal: f.montoTotal,
      entrada: f.entrada ?? 0,
      cuotaSugerida: f.cuotaSugerida
    }).subscribe({
      next: (cuenta) => {
        this.guardando = false;
        this.mostrarFormCuenta = false;
        this.cuentaAbiertaId = cuenta.id;
        this.formAbono = this.abonoVacio(cuenta);
        this.mensajeExito = 'Cuenta creada.';
        this.cargarResumen();
      },
      error: (err) => { this.guardando = false; this.mostrarError(err, 'No se pudo crear la cuenta.'); }
    });
  }

  anularCuenta(cuenta: CuentaDTO) {
    const motivo = window.prompt(`Motivo para anular la cuenta "${cuenta.descripcion}" (mínimo 5 caracteres):`);
    if (motivo === null) {
      return;
    }
    this.ejecutar(this.pagoService.anularCuenta(cuenta.id, motivo), 'Cuenta anulada.');
  }

  alternarCuenta(cuenta: CuentaDTO) {
    this.cuentaAbiertaId = this.cuentaAbiertaId === cuenta.id ? null : cuenta.id;
    this.formAbono = this.abonoVacio(cuenta);
    this.limpiarMensajes();
  }

  // ---------- Abonos ----------

  registrarAbono(cuenta: CuentaDTO) {
    const f = this.formAbono;
    if (!f.monto || f.monto <= 0) {
      this.mensajeError = 'Ingrese un monto mayor que cero.';
      return;
    }
    if (f.monto > this.porCubrir(cuenta)) {
      this.mensajeError = `El abono supera el saldo por cubrir (${this.porCubrir(cuenta).toFixed(2)}).`;
      return;
    }
    this.ejecutar(this.pagoService.registrarAbono(cuenta.id, {
      fecha: f.fecha || null,
      monto: f.monto,
      citaId: f.citaId || null,
      observacion: f.observacion.trim() || null,
      estado: f.estado
    }), f.estado === 'PAGADO' ? 'Abono registrado como pagado.' : 'Abono registrado como pendiente de pago.',
      () => { this.formAbono = this.abonoVacio(cuenta); });
  }

  aprobarAbono(abono: AbonoDTO) {
    if (!window.confirm(`¿Confirmar que se recibió el pago de $${Number(abono.monto).toFixed(2)}?`)) {
      return;
    }
    this.ejecutar(this.pagoService.aprobarAbono(abono.id), 'Pago aprobado.');
  }

  anularAbono(abono: AbonoDTO) {
    const motivo = window.prompt(`Motivo para anular el abono de $${Number(abono.monto).toFixed(2)} (mínimo 5 caracteres):`);
    if (motivo === null) {
      return;
    }
    this.ejecutar(this.pagoService.anularAbono(abono.id, motivo), 'Abono anulado.');
  }

  // ---------- Apoyo ----------

  /** Lo que aún se puede abonar: total menos abonos vigentes (pagados y pendientes). */
  porCubrir(cuenta: CuentaDTO): number {
    return Math.max(0, Number(cuenta.montoTotal) - Number(cuenta.totalPagado) - Number(cuenta.totalPendiente));
  }

  etiquetaCita(c: CitaResponseDTO): string {
    return `${c.fechaHoraInicio.substring(0, 10)} · ${c.nombreTratamiento} (${c.estado})`;
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }

  private ejecutar(peticion: ReturnType<PagoService['aprobarAbono']>, exito: string, despues?: () => void) {
    this.guardando = true;
    this.limpiarMensajes();
    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.mensajeExito = exito;
        despues?.();
        this.cargarResumen();
      },
      error: (err) => { this.guardando = false; this.mostrarError(err, 'No se pudo completar la operación.'); }
    });
  }

  private mostrarError(err: any, porDefecto: string) {
    const validaciones = err?.error?.validaciones ? Object.values(err.error.validaciones).join(' ') : '';
    if (err?.status === 403) {
      this.mensajeError = 'No tiene permisos para gestionar pagos.';
    } else {
      this.mensajeError = validaciones || err?.error?.mensaje || porDefecto;
    }
    this.cdr.detectChanges();
  }

  private limpiarMensajes() {
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  private cuentaVacia(): FormCuenta {
    return { tratamientoId: null, descripcion: '', montoTotal: null, entrada: null, cuotaSugerida: null };
  }

  private abonoVacio(cuenta: CuentaDTO | null): FormAbono {
    const hoy = new Date();
    const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
    return {
      fecha: local,
      monto: cuenta?.cuotaSugerida ? Number(cuenta.cuotaSugerida) : null,
      citaId: null,
      observacion: '',
      estado: 'PAGADO'
    };
  }
}
