import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

@Component({
  selector: 'app-ajustes-cuenta-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelPaciente],
  templateUrl: './ajustesCuentaPaciente.html',
  styleUrl: './ajustesCuentaPaciente.css'
})
export class AjustesCuentaPaciente {
  private router = inject(Router);

  // Datos simulados 
  paciente = {
    nombres: 'Anderson',
    apellidos: 'España',
    cedula: '1004567890',
    email: 'anderson@example.com',
    telefono: '0999999999',
    direccion: 'Ibarra, Ecuador',
    fechaNacimiento: '2002-06-27',
    tipoSangre: 'O+'
  };

  modoEdicion: boolean = false;
  datosEditando: any = {};

  passwords = {
    actual: '',
    nueva: '',
    confirmacion: ''
  };

  volver() {
    this.router.navigate(['/paciente/home']);
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.datosEditando = { ...this.paciente }; 
  }

  cancelarEdicion() {
    this.modoEdicion = false;
  }

  guardarDatos() {
    this.paciente = { ...this.datosEditando };
    this.modoEdicion = false;
    alert('¡Tus datos personales han sido actualizados con éxito!');
  }

  cambiarPassword() {
    if (this.passwords.nueva !== this.passwords.confirmacion) {
      alert('Error: Las contraseñas nuevas no coinciden.');
      return;
    }
    
    if (this.passwords.nueva.length < 6) {
      alert('Error: La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    console.log('Cambio de clave solicitado', this.passwords);
    alert('¡Contraseña actualizada correctamente!');
    
    this.passwords = { actual: '', nueva: '', confirmacion: '' };
  }
}