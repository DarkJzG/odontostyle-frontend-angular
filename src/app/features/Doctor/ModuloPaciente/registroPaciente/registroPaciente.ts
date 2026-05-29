//features/Doctor/ModuloPaciente/registroPaciente/registroPaciente.ts
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteService } from '../../../../core/services/paciente';
import { UsuarioService } from '../../../../core/services/usuario';
import { UsuarioDTO } from '../../../../core/models/usuarioDTO';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './registroPaciente.html',
  styleUrl: './registroPaciente.css'
})
export class RegistroPaciente {
  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  pasoActual: number = 1;
  idPacienteCreado: string = '';
  cargando: boolean = false;
  mensajeError: string = '';

  // Formulario Paso 1: Datos Personales
  usuarioForm: FormGroup = this.fb.group({
    // Eliminamos el campo 'id' temporal. El DTO en Angular lo permite si lo marcamos como opcional,
    // o el backend simplemente lo ignora al recibir un POST para creación.
    cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    nombres: ['', [Validators.required, Validators.maxLength(50)]],
    apellidos: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    rol: ['PACIENTE', Validators.required]
  });

  // Formulario Paso 2: Perfil Médico
  perfilForm: FormGroup = this.fb.group({
    // Eliminamos también el campo 'id' de aquí. El idPaciente se enviará 
    // en la URL o se construirá en el servicio antes de enviar.
    grupoSanguineo: ['', [Validators.required, Validators.maxLength(10)]],
    alergias: ['', Validators.maxLength(500)],
    medicamentosHabituales: ['', Validators.maxLength(500)],
    antecedentesFamiliares: ['', Validators.maxLength(500)],
    motivoConsultaInicial: ['', [Validators.required, Validators.maxLength(500)]]
  });

guardarPaso1() {
    if (this.usuarioForm.valid) {
      this.cargando = true;
      this.mensajeError = '';
      this.cdr.detectChanges();
      
      const payloadUsuario: UsuarioDTO = {
        id: '',
        cedula: this.usuarioForm.value.cedula,
        nombres: this.usuarioForm.value.nombres,
        apellidos: this.usuarioForm.value.apellidos,
        email: this.usuarioForm.value.email,
        telefono: this.usuarioForm.value.telefono,
        rol: this.usuarioForm.value.rol
      };
      
      this.usuarioService.crearUsuario(payloadUsuario).subscribe({
        next: (respuesta: UsuarioDTO) => {
          this.idPacienteCreado = respuesta.id;
          this.perfilForm.patchValue({ id: this.idPacienteCreado });
          this.pasoActual = 2; 
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          // AQUÍ VEREMOS EXACTAMENTE QUÉ CAMPO RECHAZÓ SPRING BOOT
          console.error("El backend rechazó los datos. Detalle completo:", err.error);
          
          if (err.error && err.error.validaciones) {
             // Si armaste el ErrorResponseDTO en tu backend, mostramos los errores exactos
             this.mensajeError = 'Errores: ' + JSON.stringify(err.error.validaciones);
          } else {
             this.mensajeError = err.error?.mensaje || 'Error de validación. Revisa la cédula y el correo.';
          }
          this.cargando = false; 
          this.cdr.detectChanges();
        }
      });
    } else {
      this.usuarioForm.markAllAsTouched();
      this.mensajeError = "Por favor, completa todos los campos obligatorios en rojo.";
    }
  }

guardarPaso2() {
    if (this.perfilForm.valid && this.idPacienteCreado) {
      this.cargando = true;
      this.mensajeError = '';
      this.cdr.detectChanges();

      const perfilAGuardar = {
        id: this.idPacienteCreado, 
        ...this.perfilForm.value
      };

      this.pacienteService.guardarPerfil(this.idPacienteCreado, perfilAGuardar).subscribe({
        next: () => {
          this.cargando = false;
          alert('¡Paciente y perfil registrados con éxito!');
          this.pasoActual = 3;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.mensajeError = 'Error al guardar el perfil médico. Intente nuevamente.';
          this.cargando = false;
          this.cdr.detectChanges();
          console.error(err);
        }
      });
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }
  // === NUEVAS FUNCIONES DE NAVEGACIÓN ===
  irAAgendarCita() {
    // Navegamos al nuevo módulo del doctor, pasándole el ID del paciente recién creado
    this.router.navigate(['/doctor/agendar-cita', this.idPacienteCreado]);
  }

  irAlPerfil() {
    this.router.navigate(['/doctor/pacientes', this.idPacienteCreado, 'detalle']); 
  }

  volverListaPacientes() {
    this.router.navigate(['/doctor/pacientes']);
  }
}
