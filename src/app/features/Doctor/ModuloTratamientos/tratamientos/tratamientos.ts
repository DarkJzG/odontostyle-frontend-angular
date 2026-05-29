import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { TratamientoService } from '../../../../core/services/tratamiento';
import { TratamientoDTO } from '../../../../core/models/tratamientoDTO';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, NavbarPanelDoctor],
  templateUrl: './tratamientos.html',
  styleUrl: './tratamientos.css'
})
export class Tratamientos implements OnInit {
  private fb = inject(FormBuilder);
  private tratamientoService = inject(TratamientoService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  tratamientos: TratamientoDTO[] = [];
  tratamientoForm: FormGroup;
  
  cargando: boolean = false;
  guardando: boolean = false;
  modoEdicion: boolean = false;
  idEdicionActiva: number | null = null;

  // UX (Toasts y Modales)
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' = 'success';
  toastTimeout: any;

  modalVisible: boolean = false;
  modalMensaje: string = '';
  accionConfirmacion: (() => void) | null = null;

  constructor() {
    this.tratamientoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      duracionMin: [30, [Validators.required, Validators.min(5), Validators.max(480)]],
      precioBase: [0, [Validators.required, Validators.min(0)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTratamientos();
  }

  // ================== UX ==================
  mostrarToast(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.cdr.detectChanges();
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMensaje = '';
      this.cdr.detectChanges();
    }, 3500);
  }

  abrirConfirmacion(mensaje: string, accion: () => void) {
    this.modalMensaje = mensaje;
    this.accionConfirmacion = accion;
    this.modalVisible = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.modalVisible = false;
    this.accionConfirmacion = null;
    this.cdr.detectChanges();
  }

  ejecutarAccionConfirmada() {
    if (this.accionConfirmacion) this.accionConfirmacion();
    this.cerrarModal();
  }

  // ================== LÓGICA ==================
  cargarTratamientos() {
    this.cargando = true;
    this.cdr.detectChanges();
    this.tratamientoService.listarTodos().subscribe({
      next: (data) => {
        this.tratamientos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('Error al cargar el catálogo de tratamientos.', 'error');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarTratamiento() {
    if (this.tratamientoForm.invalid) {
      this.tratamientoForm.markAllAsTouched();
      this.mostrarToast('Revise los campos en rojo. La duración mínima es 5 min.', 'warning');
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    const payload: TratamientoDTO = this.tratamientoForm.value;

    if (this.modoEdicion && this.idEdicionActiva) {
      this.tratamientoService.actualizar(this.idEdicionActiva, payload).subscribe({
        next: () => this.finalizarGuardado('Tratamiento actualizado con éxito.'),
        error: (err) => this.manejarErrorGuardado(err)
      });
    } else {
      this.tratamientoService.crear(payload).subscribe({
        next: () => this.finalizarGuardado('Tratamiento añadido al catálogo.'),
        error: (err) => this.manejarErrorGuardado(err)
      });
    }
  }

  editarTratamiento(t: TratamientoDTO) {
    this.modoEdicion = true;
    this.idEdicionActiva = t.id!;
    this.tratamientoForm.patchValue({
      nombre: t.nombre,
      duracionMin: t.duracionMin,
      precioBase: t.precioBase,
      descripcion: t.descripcion
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla al form
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.idEdicionActiva = null;
    this.tratamientoForm.reset({ duracionMin: 30, precioBase: 0 });
  }

  eliminarTratamiento(id: number | undefined) {
    if (!id) return;
    this.abrirConfirmacion('¿Desea eliminar este tratamiento del catálogo? Ya no estará disponible para agendar.', () => {
      this.tratamientoService.eliminar(id).subscribe({
        next: () => {
          this.mostrarToast('Tratamiento eliminado correctamente.', 'success');
          this.cargarTratamientos();
        },
        error: () => this.mostrarToast('Error al eliminar. Verifique que no tenga citas asociadas.', 'error')
      });
    });
  }

  private finalizarGuardado(mensaje: string) {
    this.guardando = false;
    this.mostrarToast(mensaje, 'success');
    this.cancelarEdicion();
    this.cargarTratamientos();
  }

  private manejarErrorGuardado(err: any) {
    this.guardando = false;
    // Si el backend lanza error de duplicidad, lo mostramos
    const msg = err?.error?.mensaje || 'Error al guardar el tratamiento.';
    this.mostrarToast(msg, 'error');
    this.cdr.detectChanges();
  }

  volverPagHome() {
    this.router.navigate(['/doctor/home']);
  }
}
