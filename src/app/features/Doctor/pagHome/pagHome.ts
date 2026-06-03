//src/app/features/Doctor/pagHome/pagHome.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../core/layout/navbarPanelDoctor/navbarPanelDoctor'; 
import { CitaService } from '../../../core/services/cita';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-pag-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelDoctor], 
  templateUrl: './pagHome.html',
  styleUrl: './pagHome.css'
})
export class PagHome implements OnInit {
  
  private router = inject(Router);
  private citaService = inject(CitaService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  fechaHoy: Date = new Date();
  cargandoCitas: boolean = true;
  citasHoy: any[] = []; 
  modulos = [
    { nombre: 'Pacientes', icono: 'people', ruta: '/doctor/pacientes' },
    { nombre: 'Horario Laboral', icono: 'schedule', ruta: '/doctor/configuracion-horarios' },
    { nombre: 'Agenda', icono: 'calendar_month', ruta: '/doctor/agenda' },
    { nombre: 'Historias Clínicas', icono: 'assignment_ind', ruta: '/doctor/historias' },
    { nombre: 'Tratamientos', icono: 'medical_services', ruta: '/doctor/tratamientos' },
  ];

  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  ngOnInit(): void {
    this.cargarCitasDeHoy();
  }

  cargarCitasDeHoy() {
    const doctorId = this.authService.obtenerIdUsuarioLogueado();

    if (doctorId) {
      this.cargandoCitas = true;
      this.citaService.obtenerCitasDeHoyPorDoctor(doctorId).subscribe({
        next: (citasBackend: any[]) => {
          if (citasBackend && Array.isArray(citasBackend)) {
            this.citasHoy = citasBackend.map(cita => {
              const horaPart = cita.fechaHoraInicio.split('T')[1];
              
              // Extraemos solo el nombre del tratamiento
              const nombreCompleto = cita.nombreTratamiento || 'Tratamiento General';
              const tratamientoLimpio = nombreCompleto.split(' con ')[0];

              return {
                hora: this.formatearHoraAMPM(horaPart),
                paciente: cita.nombrePaciente, 
                tratamiento: tratamientoLimpio,
                estado: this.normalizarEstado(cita.estado)
              };
            });
          }
          this.cargandoCitas = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar la agenda de hoy:', err);
          this.cargandoCitas = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.cargandoCitas = false;
      this.cdr.detectChanges();
    }
  }

  private formatearHoraAMPM(horaStr: string): string {
    if (!horaStr) return '';
    const partes = horaStr.split(':');
    let horas = parseInt(partes[0], 10);
    const minutos = partes[1];
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12; 
    return `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;
  }

  private normalizarEstado(estadoBackend: string): string {
    if (!estadoBackend) return 'Pendiente';
    const est = estadoBackend.toUpperCase();
    if (est === 'PENDIENTE') return 'Pendiente';
    // Visualmente, para el doctor, una cita completada o en proceso se puede ver como confirmada
    if (est === 'COMPLETADA' || est === 'ATENDIDA') return 'Confirmada'; 
    if (est === 'CANCELADA') return 'Cancelada';
    return estadoBackend;
  }

  navegarModulo(ruta: string, nombre: string) {
    if (ruta) {
      this.router.navigate([ruta]);
    } else {
      alert(`El módulo de ${nombre} se conectará pronto al backend.`);
    }
  }
}