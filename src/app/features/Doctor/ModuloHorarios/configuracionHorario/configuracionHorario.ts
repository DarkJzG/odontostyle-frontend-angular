// src/app/features/Doctor/ModuloHorarios/configuracionHorario/configuracionHorario.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { HorarioDoctorService } from '../../../../core/services/horarioDoctor';
import { HorarioDoctorDTO } from '../../../../core/models/horarioDoctorDTO';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-horario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, NavbarPanelDoctor],
  templateUrl: './configuracionHorario.html',
  styleUrl: './configuracionHorario.css'
})
export class ConfiguracionHorario implements OnInit {
  private fb = inject(FormBuilder);
  private horarioService = inject(HorarioDoctorService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Control de Vistas
  pestanaActiva: string = 'jornada'; 
  idDoctorLogueado: string = '';

  // Tab 1: Jornada Base
  horarioForm: FormGroup;
  horariosActuales: HorarioDoctorDTO[] = [];
  cargandoHorarios: boolean = false;
  guardandoHorario: boolean = false;

  // Tab 2: Ausencias
  ausenciaForm: FormGroup;
  ausenciasActuales: any[] = [];
  cargandoAusencias: boolean = false;
  guardandoAusencia: boolean = false;

  // --- VARIABLES PARA UX (TOAST Y MODAL) ---
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' = 'success';
  toastTimeout: any;

  modalVisible: boolean = false;
  modalMensaje: string = '';
  accionConfirmacion: (() => void) | null = null;

  diasSemana = [
    { id: 'MONDAY', nombre: 'Lunes' }, { id: 'TUESDAY', nombre: 'Martes' },
    { id: 'WEDNESDAY', nombre: 'Miércoles' }, { id: 'THURSDAY', nombre: 'Jueves' },
    { id: 'FRIDAY', nombre: 'Viernes' }, { id: 'SATURDAY', nombre: 'Sábado' },
    { id: 'SUNDAY', nombre: 'Domingo' }
  ];

  constructor() {
    this.horarioForm = this.fb.group({
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    });

    this.ausenciaForm = this.fb.group({
      motivo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      esDiaCompleto: [true]
    });
  }

  ngOnInit(): void {
    this.idDoctorLogueado = this.authService.obtenerIdUsuarioLogueado();
    if (this.idDoctorLogueado) {
      this.cargarHorarios();
      this.cargarAusencias();
    }
  }

  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
    this.cdr.detectChanges(); 
  }

  // ================== MÉTODOS DE EXPERIENCIA DE USUARIO (UX) ==================
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
    if (this.accionConfirmacion) {
      this.accionConfirmacion();
    }
    this.cerrarModal();
  }

  // ================== LÓGICA DE JORNADA BASE ==================
  cargarHorarios() {
    this.cargandoHorarios = true;
    this.cdr.detectChanges();

    this.horarioService.obtenerHorariosPorDoctor(this.idDoctorLogueado).subscribe({
      next: (data) => {
        this.horariosActuales = this.ordenarPorDia(data);
        this.cargandoHorarios = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.cargandoHorarios = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarHorario() {
    if (this.horarioForm.invalid) {
      this.horarioForm.markAllAsTouched();
      this.mostrarToast('Por favor, complete todos los campos.', 'warning');
      return;
    }

    const inicio = this.horarioForm.value.horaInicio;
    const fin = this.horarioForm.value.horaFin;
    const diaSeleccionado = this.horarioForm.value.diaSemana;

    if (inicio >= fin) {
      this.mostrarToast('La hora de inicio debe ser menor a la hora de fin.', 'warning');
      return;
    }

    const haySolapamiento = this.horariosActuales.some(h => {
      if (h.diaSemana === diaSeleccionado) {
        const hInicio = h.horaInicio.substring(0, 5);
        const hFin = h.horaFin.substring(0, 5);
        return (inicio < hFin && fin > hInicio);
      }
      return false;
    });

    if (haySolapamiento) {
      this.mostrarToast('Ya existe un bloque de atención que se cruza con este horario.', 'error');
      return;
    }

    this.guardandoHorario = true;
    this.cdr.detectChanges();

    const nuevoHorario: HorarioDoctorDTO = {
      idDoctor: this.idDoctorLogueado,
      diaSemana: diaSeleccionado,
      horaInicio: inicio + ':00',
      horaFin: fin + ':00'
    };

    this.horarioService.guardarHorario(nuevoHorario).subscribe({
      next: () => {
        this.guardandoHorario = false;
        this.horarioForm.reset({ diaSemana: '', horaInicio: '', horaFin: '' });
        this.mostrarToast('Bloque añadido con éxito.', 'success');
        this.cargarHorarios(); 
      },
      error: () => { 
        this.mostrarToast('Error al guardar el horario.', 'error'); 
        this.guardandoHorario = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarHorario(id: number | undefined) {
    if (!id) return;
    this.abrirConfirmacion('¿Desea eliminar este bloque de horario? Los pacientes no podrán agendar citas en este rango.', () => {
      this.horarioService.eliminarHorario(id).subscribe({
        next: () => {
          this.mostrarToast('Bloque eliminado correctamente.', 'success');
          this.cargarHorarios();
        },
        error: () => this.mostrarToast('Error al eliminar el bloque.', 'error')
      });
    });
  }

  // ================== LÓGICA DE AUSENCIAS / FERIADOS ==================
  cargarAusencias() {
    this.cargandoAusencias = true;
    this.cdr.detectChanges();

    this.horarioService.obtenerAusencias().subscribe({
      next: (data) => {
        this.ausenciasActuales = data.filter(d => d.idDoctor === this.idDoctorLogueado);
        this.cargandoAusencias = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.cargandoAusencias = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarAusencia() {
    if (this.ausenciaForm.invalid) {
      this.ausenciaForm.markAllAsTouched();
      this.mostrarToast('Revise que el motivo y fechas estén completos.', 'warning');
      return;
    }

    this.guardandoAusencia = true;
    this.cdr.detectChanges();
    
    let fInicio = this.ausenciaForm.value.fechaInicio;
    let fFin = this.ausenciaForm.value.fechaFin;

    if (this.ausenciaForm.value.esDiaCompleto) {
      fInicio = `${fInicio}T00:00:00`;
      fFin = `${fFin}T23:59:59`;
    } else {
      fInicio = `${fInicio}:00`;
      fFin = `${fFin}:00`;
    }

    const payload = {
      idDoctor: this.idDoctorLogueado,
      fechaInicio: fInicio,
      fechaFin: fFin,
      motivo: this.ausenciaForm.value.motivo,
      esDiaCompleto: this.ausenciaForm.value.esDiaCompleto
    };

    this.horarioService.crearAusencia(payload).subscribe({
      next: () => {
        this.guardandoAusencia = false;
        this.ausenciaForm.reset({ esDiaCompleto: true });
        this.mostrarToast('Excepción registrada correctamente.', 'success');
        this.cargarAusencias();
      },
      error: () => { 
        this.mostrarToast('Error al registrar la ausencia.', 'error'); 
        this.guardandoAusencia = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarAusencia(id: number | undefined) {
    if (!id) return;
    this.abrirConfirmacion('¿Estás seguro de eliminar este bloqueo? Las horas volverán a estar disponibles en su agenda.', () => {
      this.horarioService.eliminarAusencia(id).subscribe({
        next: () => {
          this.mostrarToast('Bloqueo retirado con éxito.', 'success');
          this.cargarAusencias();
        },
        error: () => this.mostrarToast('Error al eliminar el bloqueo.', 'error')
      });
    });
  }

  // Helpers visuales
  obtenerNombreDia(diaEnum: string): string {
    const dia = this.diasSemana.find(d => d.id === diaEnum);
    return dia ? dia.nombre : diaEnum;
  }

  private ordenarPorDia(horarios: HorarioDoctorDTO[]): HorarioDoctorDTO[] {
    const ordenDias = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return horarios.sort((a, b) => {
      if (a.diaSemana === b.diaSemana) return a.horaInicio.localeCompare(b.horaInicio);
      return ordenDias.indexOf(a.diaSemana) - ordenDias.indexOf(b.diaSemana);
    });
  }

  volverPagHome() {
    this.router.navigate(['/doctor']);
  }
}
