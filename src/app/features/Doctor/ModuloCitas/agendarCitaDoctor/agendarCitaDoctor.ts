// features/Doctor/ModuloCitas/agendarCitaDoctor/agendarCitaDoctor.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';

import { UsuarioService } from '../../../../core/services/usuario';
import { CitaService } from '../../../../core/services/cita';
import { TratamientoService } from '../../../../core/services/tratamiento';
import { AuthService } from '../../../../core/services/auth'; // <-- IMPORTANTE
import { TratamientoDTO } from '../../../../core/models/tratamientoDTO';

@Component({
  selector: 'app-agendar-cita-doctor',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelDoctor],
  templateUrl: './agendarCitaDoctor.html',
  styleUrl: './agendarCitaDoctor.css' 
})
export class AgendarCitaDoctor implements OnInit {
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private citaService = inject(CitaService);
  private tratamientoService = inject(TratamientoService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService); // <-- Para saber quién es el doctor actual
  private cdr = inject(ChangeDetectorRef);

  pasoActual: number = 1;
  idPacienteTarget: string = ''; 
  nombrePacienteTarget: string = 'Cargando paciente...';

  listaTratamientos: TratamientoDTO[] = [];
  horasDisponibles: string[] = [];

  tratamientoSeleccionado: TratamientoDTO | null = null;
  // El doctor se selecciona solo por detrás
  idDoctorLogueado: string = '';
  fechaSeleccionada: string = ''; 
  horaSeleccionada: string = '';

  cargandoDatos: boolean = true;
  buscandoHoras: boolean = false;
  guardandoCita: boolean = false;
  citaConfirmada: boolean = false;

  ngOnInit(): void {
    // 1. Validar al doctor
    this.idDoctorLogueado = this.authService.obtenerIdUsuarioLogueado();
    if (!this.idDoctorLogueado) {
      alert("Error crítico: Doctor no identificado.");
      this.router.navigate(['/']);
      return;
    }

    // 2. Capturar al paciente de la URL
    this.idPacienteTarget = this.route.snapshot.paramMap.get('idPaciente') || '';
    if (!this.idPacienteTarget) {
      alert("Error: No se proporcionó un paciente válido.");
      this.router.navigate(['/doctor/agenda']);
      return;
    }

    // 3. Buscar nombre del paciente
    this.usuarioService.obtenerPorId(this.idPacienteTarget).subscribe({
      next: (user) => {
        this.nombrePacienteTarget = `${user.nombres} ${user.apellidos}`;
        this.cargarCatalogos(); // Solo cargamos tratamientos ahora
      },
      error: () => {
        alert("El paciente no existe en el sistema.");
        this.router.navigate(['/doctor/agenda']);
      }
    });
  }

  cargarCatalogos() {
    this.cargandoDatos = true;
    this.cdr.detectChanges();
    
    this.tratamientoService.obtenerTratamientosActivos().subscribe({
      next: (trats) => {
        this.listaTratamientos = trats;
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      }
    });
  }

  // WIZARD ACELERADO
  seleccionarTratamiento(tratamiento: TratamientoDTO) {
    this.tratamientoSeleccionado = tratamiento;
    // Saltamos directo al Paso 3 (Calendario) porque el Doctor ya somos nosotros
    this.pasoActual = 3; 
    
    if(!this.fechaSeleccionada) {
      this.fechaSeleccionada = new Date().toISOString().split('T')[0];
    }
    this.buscarHorarios();
  }

  cambiarFecha(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.value;
    this.horaSeleccionada = ''; 
    this.buscarHorarios();
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
    this.pasoActual = 4;
  }

  volverPaso(paso: number) {
    if (this.guardandoCita || this.citaConfirmada) return;
    // Si quiere volver atrás desde el calendario, lo devolvemos directo a tratamientos
    this.pasoActual = paso === 2 ? 1 : paso; 
  }

  buscarHorarios() {
    if (!this.fechaSeleccionada || !this.tratamientoSeleccionado) return;

    this.buscandoHoras = true;
    this.horasDisponibles = [];
    this.cdr.detectChanges();

    // Consultamos al motor de disponibilidad pasando nuestro ID de doctor
    this.citaService.obtenerHorasDisponibles(
      this.idDoctorLogueado,
      this.fechaSeleccionada,
      this.tratamientoSeleccionado.id!
    ).subscribe({
      next: (horas) => {
        this.horasDisponibles = horas;
        this.buscandoHoras = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmarCita() {
    if (!this.tratamientoSeleccionado || !this.fechaSeleccionada || !this.horaSeleccionada) return;

    this.guardandoCita = true;
    this.cdr.detectChanges();

    // DTO PERFECTAMENTE ALINEADO
    const payload = {
      idPaciente: this.idPacienteTarget, // El paciente "Walk-in" tiene un UUID estándar
      idTratamiento: this.tratamientoSeleccionado.id!,
      idDoctor: this.idDoctorLogueado, // Para el doctor usamos su llave interna, no Keycloak ID
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
        console.error("Backend Error:", err.error);
        const mensajeError = err.error?.mensaje || "Horario ya no disponible o error interno.";
        alert(mensajeError);
        this.pasoActual = 3; 
        this.buscarHorarios();
        this.cdr.detectChanges();
      }
    });
  }

  volverAlInicio() {
    this.router.navigate(['/doctor/agenda']);
  }
}