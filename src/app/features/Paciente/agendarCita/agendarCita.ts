// features/Paciente/agendarCita/agendarCita.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

import { AuthService } from '../../../core/services/auth';
import { UsuarioService } from '../../../core/services/usuario';
import { CitaService } from '../../../core/services/cita';
import { TratamientoService} from '../../../core/services/tratamiento';
import { TratamientoDTO } from '../../../core/models/tratamientoDTO';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelPaciente],
  templateUrl: './agendarCita.html',
  styleUrl: './agendarCita.css'
})
export class AgendarCita implements OnInit {
  
  private router = inject(Router);
  private authService = inject(AuthService);
  private citaService = inject(CitaService);
  private tratamientoService = inject(TratamientoService);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  // Pasos del Wizard (1, 2, 3, 4)
  pasoActual: number = 1;

  // Listas de Datos
  listaTratamientos: TratamientoDTO[] = [];
  listaDoctores: any[] = [];
  fechasDisponibles: Date[] = []; // Opcional, para un calendario avanzado
  horasDisponibles: string[] = [];

  // Selecciones del Usuario
  idPacienteLogueado: string = '';
  tratamientoSeleccionado: TratamientoDTO | null = null;
  doctorSeleccionado: any | null = null;
  fechaSeleccionada: string = ''; // Formato YYYY-MM-DD
  horaSeleccionada: string = '';

  // Estados
  cargandoDatos: boolean = true;
  buscandoHoras: boolean = false;
  guardandoCita: boolean = false;
  citaConfirmada: boolean = false;

  ngOnInit(): void {
    this.idPacienteLogueado = this.authService.obtenerIdUsuarioLogueado();
    if (!this.idPacienteLogueado) {
      alert("Error de sesión. Inicie sesión nuevamente.");
      this.router.navigate(['/']);
      return;
    }
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.cargandoDatos = true;
    this.cdr.detectChanges();
    
    // 1. Cargar Tratamientos
    this.tratamientoService.obtenerTratamientosActivos().subscribe({
      next: (trats) => {
        this.listaTratamientos = trats;
        
        // 2. Cargar Doctores
        this.usuarioService.obtenerListaDoctores().subscribe({
          next: (docs) => {
            this.listaDoctores = docs;
            setTimeout(() => {
              this.cargandoDatos = false;
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            console.error('Error al cargar doctores:', err);
            this.finalizarCargaConError();
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar tratamientos:', err);
        this.finalizarCargaConError();
      }
    });
  }

  finalizarCargaConError() {
    this.cargandoDatos = false;
    alert("Error al conectar con la clínica. Intente de nuevo más tarde.");
    this.cdr.detectChanges();
  }

  // ================== CONTROL DEL WIZARD ==================

  seleccionarTratamiento(tratamiento: TratamientoDTO) {
    this.tratamientoSeleccionado = tratamiento;
    this.pasoActual = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  seleccionarDoctor(doctor: any) {
    this.doctorSeleccionado = doctor;
    this.pasoActual = 3;
    
    // Pre-seleccionar la fecha de hoy si no hay ninguna
    if(!this.fechaSeleccionada) {
      const hoy = new Date();
      this.fechaSeleccionada = hoy.toISOString().split('T')[0];
    }
    
    this.buscarHorarios();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cambiarFecha(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.value;
    this.horaSeleccionada = ''; // Resetear hora si cambia de día
    this.buscarHorarios();
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
    this.pasoActual = 4;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volverPaso(paso: number) {
    if (this.guardandoCita || this.citaConfirmada) return;
    this.pasoActual = paso;
  }

  // ================== LÓGICA CORE (BACKEND) ==================

  buscarHorarios() {
    if (!this.doctorSeleccionado || !this.fechaSeleccionada || !this.tratamientoSeleccionado) return;

    this.buscandoHoras = true;
    this.horasDisponibles = [];
    this.cdr.detectChanges();

    this.citaService.obtenerHorasDisponibles(
      this.doctorSeleccionado.keycloakId || this.doctorSeleccionado.id, // Depende de cómo venga del backend
      this.fechaSeleccionada,
      this.tratamientoSeleccionado.id!
    ).subscribe({
      next: (horas) => {
        this.horasDisponibles = horas;
        this.buscandoHoras = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error buscando horas:", err);
        this.buscandoHoras = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmarCita() {
    if (!this.tratamientoSeleccionado || !this.doctorSeleccionado || !this.fechaSeleccionada || !this.horaSeleccionada) return;

    this.guardandoCita = true;
    this.cdr.detectChanges();

    // Ensamblar el DTO para el backend
    const payload = {
      idPaciente: this.idPacienteLogueado,
      idTratamiento: this.tratamientoSeleccionado.id!,
      idDoctor: this.doctorSeleccionado.id,
      fechaHoraInicio: `${this.fechaSeleccionada}T${this.horaSeleccionada}:00`
    };

    this.citaService.agendarCita(payload as any).subscribe({
      next: () => {
        this.guardandoCita = false;
        this.citaConfirmada = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardandoCita = false;
        const mensajeError = err.error?.mensaje || "El horario seleccionado ya no está disponible. Por favor, seleccione otro.";
        alert(mensajeError);
        this.pasoActual = 3; 
        this.buscarHorarios();
        this.cdr.detectChanges();
      }
    });
  }

  volverAlInicio() {
    this.router.navigate(['/paciente/home']);
  }
}