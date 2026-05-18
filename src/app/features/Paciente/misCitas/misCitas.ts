import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelPaciente, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './misCitas.html',
  styleUrl: './misCitas.css'
})
export class MisCitas {
  private router = inject(Router);

  citas = [
    { id: 1, tratamiento: 'Limpieza Dental', fecha: '2026-05-25', hora: '10:00 AM', doctor: 'Dr. Roberto Sánchez', estado: 'Pendiente', notas: 'Paciente solicitó especial cuidado en encías sensibles.' },
    { id: 2, tratamiento: 'Blanqueamiento', fecha: '2026-04-10', hora: '03:30 PM', doctor: 'Dra. María Elena', estado: 'Completada', notas: 'Procedimiento exitoso. Control en 6 meses.' },
    { id: 3, tratamiento: 'Extracción Simple', fecha: '2026-05-02', hora: '09:15 AM', doctor: 'Dr. Roberto Sánchez', estado: 'Cancelada', notas: 'Cancelado por el paciente.' },
    { id: 4, tratamiento: 'Consulta General', fecha: '2026-01-15', hora: '11:30 AM', doctor: 'Dra. María Elena', estado: 'Completada', notas: 'Revisión inicial, buena salud dental general.' }
  ];

  horasDisponibles = ['08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'];

  // === VARIABLES PARA LOS FILTROS ===
  terminoBusqueda: string = '';
  estadoFiltro: string = 'Todos';
  fechaFiltro: string = '';

  // Estados de los modales
  citaSeleccionada: any = null;
  modoEdicion: boolean = false;
  citaEditando: any = {}; 

  dialogo = {
    visible: false,
    mensaje: '',
    tipo: '', 
    accionConfirmar: () => {}
  };

  volver() {
    this.router.navigate(['/paciente/home']);
  }

  // === MOTOR DE FILTRADO EN TIEMPO REAL ===
  get citasFiltradas() {
    return this.citas.filter(cita => {
      // 1. Filtro por texto (Tratamiento o Doctor)
      const coincideTexto = 
        cita.tratamiento.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        cita.doctor.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      // 2. Filtro por Estado
      const coincideEstado = this.estadoFiltro === 'Todos' || cita.estado === this.estadoFiltro;

      // 3. Filtro por Fecha
      const coincideFecha = !this.fechaFiltro || cita.fecha === this.fechaFiltro;

      return coincideTexto && coincideEstado && coincideFecha;
    });
  }

  // Limpiar todos los filtros de golpe
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
    const index = this.citas.findIndex(c => c.id === this.citaSeleccionada.id);
    if (index !== -1) {
      this.citas[index].fecha = this.citaEditando.fecha;
      this.citas[index].hora = this.citaEditando.hora;
      this.citaSeleccionada = this.citas[index];
      this.modoEdicion = false;
      this.mostrarNotificacion('¡Tu cita ha sido reprogramada con éxito!', 'exito');
    }
  }

  pedirCancelacion(id: number) {
    this.dialogo = {
      visible: true,
      mensaje: '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.',
      tipo: 'peligro',
      accionConfirmar: () => this.ejecutarCancelacion(id)
    };
  }

  pedirEliminacion(id: number) {
    this.dialogo = {
      visible: true,
      mensaje: '¿Deseas eliminar este registro de tu historial de forma permanente?',
      tipo: 'alerta',
      accionConfirmar: () => this.ejecutarEliminacion(id)
    };
  }

  ejecutarCancelacion(id: number) {
    const cita = this.citas.find(c => c.id === id);
    if (cita) {
      cita.estado = 'Cancelada';
      this.cerrarDialogo();
      this.mostrarNotificacion('La cita ha sido cancelada.', 'exito');
    }
  }

  ejecutarEliminacion(id: number) {
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
}