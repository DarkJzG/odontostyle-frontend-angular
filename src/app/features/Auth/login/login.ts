import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Asegúrate de poner la ruta correcta a tu auth.service
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css' 
})
export class Login {
  
  usuario: string = '';
  contrasena: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  private router = inject(Router);
  private authService = inject(AuthService); // <-- Inyectamos el servicio

  iniciarSesion() {
    this.cargando = true;
    this.mensajeError = ''; 

    // Preparamos las credenciales
    const credenciales = { username: this.usuario, password: this.contrasena };

    // Llamamos al MODO DEMO del servicio
    this.authService.iniciarSesion(credenciales).subscribe({
      next: (respuesta) => {
        // 1. Guardamos el token simulado ('fake-jwt-token-doctor')
        this.authService.guardarToken(respuesta.token);

        // 2. Leemos el rol desde el token falso
        const rol = this.authService.obtenerRolUsuario();

        // 3. Redirigimos según el rol (El Guard ahora sí te dejará pasar)
        if (rol === 'DOCTOR' || rol === 'ASISTENTE') {
          this.router.navigate(['/doctor/home']);
        } else if (rol === 'PACIENTE') {
          this.router.navigate(['/portal-paciente']);
        }
        
        this.cargando = false;
      },
      error: (err) => {
        // Si escribe mal la clave, el servicio lanza el error y cae aquí
        this.mensajeError = 'Usuario o contraseña incorrectos. Verifique sus datos.';
        this.cargando = false;
      }
    });
  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}