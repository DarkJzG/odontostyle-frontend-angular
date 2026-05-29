//features/Paciente/pagHomePaciente/pagHomePaciente.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

import { AuthService } from '../../../core/services/auth';
import { CitaService } from '../../../core/services/cita';

@Component({
  selector: 'app-pag-home-paciente',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelPaciente],
  templateUrl: './pagHomePaciente.html',
  styleUrl: './pagHomePaciente.css'
})
export class PagHomePaciente implements OnInit {
  
  private router = inject(Router);
  private authService = inject(AuthService);
  private citaService = inject(CitaService);
  private cdr = inject(ChangeDetectorRef); // <-- EL DESPERTADOR DE ANGULAR

  nombrePaciente: string = 'Paciente'; 
  proximaCita: any = null;
  cargando: boolean = true; 

  modulos = [
    { nombre: 'Agendar Cita', icono: 'event_available', ruta: '/paciente/agendar-cita' },
    { nombre: 'Mis Citas', icono: 'calendar_month', ruta: '/paciente/citas' },
    { nombre: 'Mi Historial', icono: 'history', ruta: '/paciente/historial' },
    { nombre: 'Mi Perfil', icono: 'person', ruta: '/paciente/cuenta-paciente' },
  ];

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // 1. Obtener nombre seguro desde el Token
    if (this.authService.estaLogueado()) {
      this.nombrePaciente = this.authService.obtenerNombreUsuario().split(' ')[0];
    } else {
      this.nombrePaciente = 'Paciente';
    }
    const idPaciente = this.authService.obtenerIdUsuarioLogueado();

    if (idPaciente) {
      this.citaService.obtenerCitasPorPaciente(idPaciente).subscribe({
        next: (citas: any[]) => {
          
          // Validación extra por seguridad: asegurarnos de que la respuesta es realmente un arreglo
          if (citas && Array.isArray(citas)) {
            const citasPendientes = citas
              .filter(c => c.estado && c.estado.toUpperCase() === 'PENDIENTE')
              .sort((a, b) => new Date(a.fechaHoraInicio).getTime() - new Date(b.fechaHoraInicio).getTime());

            if (citasPendientes.length > 0) {
              const proxima = citasPendientes[0];
              const [fechaPart, horaPart] = proxima.fechaHoraInicio.split('T');
              
              this.proximaCita = {
                fecha: this.formatearFechaLarga(fechaPart),
                hora: this.formatearHoraAMPM(horaPart),
                doctor: 'Dr. Odontólogo Asignado',
                tratamiento: proxima.nombreTratamiento || proxima.tratamiento,
                estado: 'Confirmada' 
              };
            }
          }
          
          this.cargando = false;
          this.cdr.detectChanges(); // <-- OBLIGAMOS A ANGULAR A DIBUJAR EL RESULTADO
        },
        error: (err: any) => {
          console.error('Error al cargar próxima cita:', err);
          this.cargando = false;
          this.cdr.detectChanges(); // <-- DESPERTAR A ANGULAR INCLUSO SI HAY ERROR
        }
      });
    } else {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private formatearFechaLarga(fechaStr: string): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const [year, month, day] = fechaStr.split('-');
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]}, ${year}`;
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

  navegarModulo(ruta: string, nombre: string) {
    if (ruta) {
      this.router.navigate([ruta]);
    } else {
      alert(`El módulo de ${nombre} estará disponible pronto.`);
    }
  }
}