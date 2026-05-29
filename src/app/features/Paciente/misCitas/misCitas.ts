// features/Paciente/misCitas/misCitas.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

import { CitaService } from '../../../core/services/cita';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  // Hemos limpiado módulos innecesarios de DatePicker ya que quitamos la edición directa
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelPaciente],
  templateUrl: './misCitas.html',
  styleUrl: './misCitas.css'
})
export class MisCitas implements OnInit {
  private router = inject(Router);
  private citaService = inject(CitaService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  citas: any[] = [];
  cargando: boolean = true; 

  terminoBusqueda: string = '';
  estadoFiltro: string = 'Todos';
  fechaFiltro: string = '';

  citaSeleccionada: any = null;

  dialogo = {
    visible: false,
    mensaje: '',
    tipo: '', 
    accionConfirmar: () => {}
  };

  ngOnInit(): void {
    this.cargarCitasDelPaciente();
  }

  cargarCitasDelPaciente() {
    const idPaciente = this.authService.obtenerIdUsuarioLogueado();

    if (idPaciente) {
      this.cargando = true; 
      this.cdr.detectChanges();

      this.citaService.obtenerCitasPorPaciente(idPaciente).subscribe({
        next: (listaBackend: any) => {
          this.citas = listaBackend.map((cita: any) => {
            const [fechaPart, horaPart] = cita.fechaHoraInicio.split('T');
            const idOriginal = cita.id; 
            
            const nombreCompletoTrat = cita.nombreTratamiento || cita.tratamiento || '';
            const partes = nombreCompletoTrat.split(' con ');
            const nombreTratamientoLimpio = partes[0];
            const nombreDoctorReal = partes[1] || 'Dr. Asignado';
  
            return {
              id: idOriginal, 
              idRecortado: idOriginal ? idOriginal.toString().substring(0, 8).toUpperCase() : 'N/A', 
              tratamiento: nombreTratamientoLimpio,
              fecha: fechaPart, 
              hora: this.formatearHoraAMPM(horaPart), 
              doctor: nombreDoctorReal,
              estado: this.normalizarEstado(cita.estado), 
              notes: 'Recuerde llegar 10 minutos antes de su turno programado.'
            };
          });
          // Ordenar: Las pendientes primero, luego por fecha más reciente
          this.citas.sort((a, b) => {
            if (a.estado === 'Pendiente' && b.estado !== 'Pendiente') return -1;
            if (a.estado !== 'Pendiente' && b.estado === 'Pendiente') return 1;
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });

          this.cargando = false; 
          this.cdr.detectChanges(); 
        },
        error: (err:any) => {
          console.error('Error al recuperar las citas:', err);
          this.cargando = false; 
          this.cdr.detectChanges(); 
        }
      });
    } else {
      this.cargando = false;
    }
  }

  get citasFiltradas() {
    return this.citas.filter(cita => {
      const coincideTexto = 
        cita.tratamiento.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        cita.doctor.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      const coincideEstado = this.estadoFiltro === 'Todos' || cita.estado === this.estadoFiltro;
      const coincideFecha = !this.fechaFiltro || cita.fecha === this.fechaFiltro;

      return coincideTexto && coincideEstado && coincideFecha;
    });
  }

  // ============ GESTIÓN DE ACCIONES ============

  pedirCancelacion(id: string) {
    this.dialogo = {
      visible: true,
      mensaje: '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer y el horario quedará libre para otros pacientes.',
      tipo: 'peligro',
      accionConfirmar: () => this.ejecutarCancelacion(id)
    };
  }

  ejecutarCancelacion(id: string) {
    this.citaService.cancelarCita(id).subscribe({
      next: () => {
        this.cerrarDialogo();
        this.cerrarDetalles();
        this.mostrarNotificacion('La cita ha sido cancelada con éxito.', 'exito');
        this.cargarCitasDelPaciente(); // Recarga la lista conectándose al backend
      },
      error: (err:any) => {
        console.error('Error:', err);
        this.cerrarDialogo();
        this.mostrarNotificacion('No se pudo procesar la cancelación. Intente más tarde.', 'peligro');
      }
    });
  }

  irAAgendar() {
    this.router.navigate(['/paciente/agendar-cita']);
  }

  // ============ HELPERS Y UI ============

  private normalizarEstado(estadoBackend: string): string {
    if (!estadoBackend) return 'Pendiente';
    const est = estadoBackend.toUpperCase();
    if (est === 'PENDIENTE') return 'Pendiente';
    if (est === 'COMPLETADA' || est === 'ATENDIDA') return 'Completada';
    if (est === 'CANCELADA') return 'Cancelada';
    return estadoBackend;
  }

  private formatearHoraAMPM(horaStr: string): string {
    if (!horaStr) return 'Por definir';
    const partes = horaStr.split(':');
    let horas = parseInt(partes[0], 10);
    const minutos = partes[1];
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12; 
    return `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.estadoFiltro = 'Todos';
    this.fechaFiltro = '';
  }

  verDetalles(cita: any) {
    this.citaSeleccionada = cita;
  }

  cerrarDetalles() {
    this.citaSeleccionada = null;
  }

  mostrarNotificacion(mensaje: string, tipo: string) {
    this.dialogo = {
      visible: true,
      mensaje: mensaje,
      tipo: tipo,
      accionConfirmar: () => this.cerrarDialogo()
    };
  }

  cerrarDialogo() {
    this.dialogo.visible = false;
  }

  volver() {
    this.router.navigate(['/paciente/home']);
  }
}