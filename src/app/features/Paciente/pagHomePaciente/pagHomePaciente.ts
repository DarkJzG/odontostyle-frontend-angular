//features/Paciente/pagHomePaciente/pagHomePaciente.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

import { AuthService } from '../../../core/services/auth';
import { CitaService } from '../../../core/services/cita';
import { UsuarioService } from '../../../core/services/usuario';
import { UsuarioDTO } from '../../../core/models/usuarioDTO';

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
  private usuarioService = inject(UsuarioService);
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
  if (!this.authService.estaLogueado()) {
    this.cargando = false;
    return;
  }

  this.nombrePaciente = this.authService.obtenerNombreUsuario().split(' ')[0];
  const keycloakId = this.authService.obtenerIdUsuarioLogueado();

  this.citaService.obtenerCitasPorPaciente(keycloakId).subscribe({
    next: (citas: any[]) => {
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
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.warn('No se encontraron citas o el paciente aún no registra historial.');
      this.cargando = false;
      this.cdr.detectChanges();
    }
  });
}

  private sincronizarNuevoUsuario(keycloakId: string) {
    const datosToken = this.authService.obtenerDatosCompletosToken();

    const cedulaTemporal = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const nuevoUsuario: any = {
      keycloakId: keycloakId,
      nombre: datosToken.nombre || 'Nombres',
      apellidos: datosToken.apellido || 'Apellidos',
      email: datosToken.email || 'sin-correo@odontostyle.com',
      cedula: cedulaTemporal, // Cédula por defecto para que complete en 'Mi Perfil'
      rol: 'PACIENTE'
    };

    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        console.log('Paciente sincronizado exitosamente en la base de datos');
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al sincronizar paciente:', e);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
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