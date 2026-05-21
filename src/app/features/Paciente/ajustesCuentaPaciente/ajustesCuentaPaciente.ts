import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

import { UsuarioDTO } from '../../../core/models/usuarioDTO';
import { UsuarioService } from '../../../core/services/usuario';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-ajustes-cuenta-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelPaciente],
  templateUrl: './ajustesCuentaPaciente.html',
  styleUrl: './ajustesCuentaPaciente.css'
})
export class AjustesCuentaPaciente implements OnInit {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  // Mezclamos el molde real con los datos estáticos de relleno para no romper el HTML
  paciente: any = {
    idUsuario: '',
    nombres: 'Cargando...',
    apellidos: 'Cargando...',
    cedula: '',
    email: '',
    telefono: '',
    rol: '',
    direccion: 'Ibarra, Ecuador', // Dato estático provisional
    fechaNacimiento: '2002-06-27', // Dato estático provisional
    tipoSangre: 'O+' // Dato estático provisional
  };

  modoEdicion: boolean = false;
  datosEditando: any = {};

  passwords = { actual: '', nueva: '', confirmacion: '' };

  ngOnInit(): void {
    this.cargarDatosReales();
  }

  cargarDatosReales() {
    const idUsuario = this.authService.obtenerIdUsuarioLogueado();
    
    if (idUsuario) {
      this.usuarioService.obtenerPorId(idUsuario).subscribe({
        next: (datosBackend: UsuarioDTO) => {
          // Sobreescribimos los datos falsos con los reales de Postgres
          this.paciente = { ...this.paciente, ...datosBackend };
          console.log('Datos cargados de BD:', this.paciente);
        },
        error: (err) => console.error('Error al cargar perfil:', err)
      });
    }
  }

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
    const idUsuario = this.authService.obtenerIdUsuarioLogueado();

    if (idUsuario) {
      // Armamos el DTO solo con los datos que espera tu backend
      const usuarioActualizado: UsuarioDTO = {
        idUsuario: this.paciente.idUsuario,
        cedula: this.paciente.cedula,
        nombres: this.paciente.nombres,
        apellidos: this.paciente.apellidos,
        email: this.datosEditando.email,
        telefono: this.datosEditando.telefono,
        rol: this.paciente.rol
      };

      this.usuarioService.actualizarUsuario(idUsuario, usuarioActualizado).subscribe({
        next: (respuestaBackend) => {
          this.paciente = { ...this.paciente, ...respuestaBackend, direccion: this.datosEditando.direccion };
          this.modoEdicion = false;
          alert('¡Tus datos han sido actualizados en PostgreSQL!');
        },
        error: (err) => {
          console.error('Error actualizando:', err);
          alert('No se pudieron guardar los cambios.');
        }
      });
    }
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