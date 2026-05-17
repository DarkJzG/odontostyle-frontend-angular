import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelPaciente, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatFormFieldModule],
  templateUrl: './agendarCita.html',
  styleUrl: './agendarCita.css'
})
export class AgendarCita {
  
  private router = inject(Router);
  // Datos simulados (Luego vendrán del backend)
  tratamientos = [
    { id: 1, nombre: 'Limpieza Dental', duracion: '30 min', precio: '$30' },
    { id: 2, nombre: 'Blanqueamiento', duracion: '60 min', precio: '$80' },
    { id: 3, nombre: 'Extracción Simple', duracion: '45 min', precio: '$40' },
    { id: 4, nombre: 'Consulta General', duracion: '30 min', precio: '$20' }
  ];

  horasDisponibles = ['08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'];

  // Aquí guardamos lo que el paciente va eligiendo
  cita = {
    tratamientoId: null,
    fecha: '',
    hora: ''
  };

  agendar() {
    console.log('Datos listos para enviar al backend:', this.cita);
    alert('¡Cita agendada con éxito! (Modo Simulación)');
    // Más adelante aquí haremos el this.http.post(...)
  }

  cancelar() {
    this.router.navigate(['/paciente/home']);
  }

  // Método auxiliar para la interfaz
  obtenerNombreTratamiento(): string {
    const trat = this.tratamientos.find(t => t.id == this.cita.tratamientoId);
    return trat ? trat.nombre : 'Seleccione un tratamiento';
  }
}