import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// NUEVOS IMPORTS PARA EL MODAL ELEGANTE
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CitaService } from '../../../core/services/cita';
import { AuthService } from '../../../core/services/auth';
import { CitaResponseDTO } from '../../../core/models/citaDTO';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  // AGREGAMOS LOS MÓDULOS AQUÍ
  imports: [
    CommonModule, FormsModule, MatIconModule, NavbarPanelPaciente, 
    MatDatepickerModule, MatNativeDateModule, MatSelectModule, 
    MatFormFieldModule, MatInputModule
  ],
  templateUrl: './misCitas.html',
  styleUrl: './misCitas.css'
})
export class MisCitas implements OnInit {
  private router = inject(Router);
  private citaService = inject(CitaService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef); // <-- EL DESPERTADOR DE ANGULAR

  citas: any[] = [];
  cargando: boolean = true; 

  horasDisponibles = ['08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'];

  terminoBusqueda: string = '';
  estadoFiltro: string = 'Todos';
  fechaFiltro: string = '';

  citaSeleccionada: any = null;
  modoEdicion: boolean = false;
  citaEditando: any = {}; 

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

      this.citaService.obtenerCitasPorPaciente(idPaciente).subscribe({
        next: (listaBackend: any) => {
          this.citas = listaBackend.map((cita: any) => {
            const [fechaPart, horaPart] = cita.fechaHoraInicio.split('T');
            const idOriginal = cita.id || cita.idCita || '';
            
            return {
              id: idOriginal, 
              idRecortado: idOriginal.toString().substring(0, 8).toUpperCase(), 
              tratamiento: cita.nombreTratamiento || cita.tratamiento,
              fecha: fechaPart, 
              hora: this.formatearHoraAMPM(horaPart), 
              doctor: 'Dr. Odontólogo Asignado', 
              estado: this.normalizarEstado(cita.estado), 
              notes: 'Cita recuperada de forma segura desde la base de datos.'
            };
          });

          this.cargando = false; 
          this.cdr.detectChanges(); // <-- OBLIGAMOS A ANGULAR A DIBUJAR LA PANTALLA INMEDIATAMENTE
        },
        error: (err:any) => {
          console.error('Error al recuperar las citas:', err);
          this.cargando = false; 
          this.cdr.detectChanges(); // <-- TAMBIÉN LO DESPERTAMOS SI HAY ERROR
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

  pedirCancelacion(id: string) {
    this.dialogo = {
      visible: true,
      mensaje: '¿Estás seguro de que deseas cancelar esta cita?',
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
        this.cargarCitasDelPaciente(); 
      },
      error: (err:any) => {
        console.error('Error:', err);
        alert('No se pudo procesar la cancelación.');
      }
    });
  }

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
    this.modoEdicion = false;
  }

  cerrarDetalles() {
    this.citaSeleccionada = null;
    this.modoEdicion = false;
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.citaEditando = { ...this.citaSeleccionada }; 
  }

  guardarEdicion() {
    alert('Función de reprogramación activa.');
    this.modoEdicion = false;
  }

  pedirEliminacion(id: any) {
    this.dialogo = {
      visible: true,
      mensaje: '¿Deseas eliminar este registro de tu historial?',
      tipo: 'alerta',
      accionConfirmar: () => this.ejecutarEliminacion(id)
    };
  }

  ejecutarEliminacion(id: any) {
    this.citas = this.citas.filter(c => c.id !== id);
    this.cerrarDialogo();
    this.cerrarDetalles();
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