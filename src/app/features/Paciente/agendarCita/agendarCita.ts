import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';

// AQUÍ ESTÁN LAS HERRAMIENTAS QUE FALTABAN
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';
import { CitaService } from '../../../core/services/cita';
import { AuthService } from '../../../core/services/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  // SE INCLUYEN EN LOS IMPORTS DEL COMPONENTE
  imports: [
    CommonModule, FormsModule, MatIconModule, NavbarPanelPaciente, 
    MatDatepickerModule, MatNativeDateModule, MatInputModule, 
    MatFormFieldModule, MatSelectModule, MatSnackBarModule
  ],
  templateUrl: './agendarCita.html',
  styleUrl: './agendarCita.css'
})
export class AgendarCita implements OnInit {
  
  private router = inject(Router);
  private citaService = inject(CitaService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); 

  tratamientos: any[] = [];
  horasDisponibles = ['08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'];

  cita = {
    tratamientoId: null as number | null,
    fecha: null as Date | null,
    horaSeleccionada: '' 
  };

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/tratamientos`).subscribe({
      next: (data) => this.tratamientos = data,
      error: (err) => console.error('Error al cargar tratamientos', err)
    });
  }

  agendar() {
    const idPaciente = this.authService.obtenerIdUsuarioLogueado();
    
    if (!idPaciente || !this.cita.fecha || !this.cita.horaSeleccionada || !this.cita.tratamientoId) {
      this.mostrarNotificacion('Por favor completa todos los campos.', 'error');
      return;
    }

    const fechaISO = this.convertirAFormatoJava(this.cita.fecha, this.cita.horaSeleccionada);

    const nuevaCita: any = {
      pacienteId: idPaciente,
      tratamientoId: Number(this.cita.tratamientoId),
      fechaHoraInicio: fechaISO
    };

    this.citaService.agendarCita(nuevaCita).subscribe({
      next: (respuesta) => {
        this.mostrarNotificacion(`¡Reserva confirmada! Tratamiento: ${respuesta.nombreTratamiento}`, 'exito');
        this.router.navigate(['/paciente/citas']); // Te redirigimos a "Mis Citas" de una vez
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'No se pudo agendar. Verifica la disponibilidad.';
        this.mostrarNotificacion(mensajeError, 'error');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/paciente/home']);
  }

  obtenerNombreTratamiento(): string {
    const trat = this.tratamientos.find(t => t.id === this.cita.tratamientoId);
    return trat ? trat.nombre : 'Seleccione un tratamiento';
  }

  // MÉTODO PARA MANEJAR LAS ALERTAS MODERNAS
  private mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000, 
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: tipo === 'exito' ? ['snack-success'] : ['snack-error']
    });
  }

  private convertirAFormatoJava(fecha: Date, horaStr: string): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');

    const [time, modifier] = horaStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();

    hours = hours.padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }
}