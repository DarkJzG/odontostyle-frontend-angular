import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css' 
})
export class Login {
  
  // Variables para enlazar con el HTML
  usuario: string = '';
  contrasena: string = '';
  mensajeError: string = '';

  constructor(private router: Router) {}

  iniciarSesion() {
    this.mensajeError = ''; // Limpiamos errores previos

    // Simulación de autenticación temporal (Antes de implementar JWT/Keycloak)
    if (this.usuario === 'Doctor' && this.contrasena === 'doctor123') {
      
      // Redirige a tu módulo (Módulo A)
      this.router.navigate(['/doctor/home']);
      
    } else if (this.usuario === 'Paciente' && this.contrasena === 'paciente123') {
      
      // Redirige al módulo de Anderson (Módulo B)
      this.router.navigate(['/portal-paciente']);
      
    } else {
      // Credenciales incorrectas
      this.mensajeError = 'Usuario o contraseña incorrectos. Verifique sus datos.';
    }
  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}