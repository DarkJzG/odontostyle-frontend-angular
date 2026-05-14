import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteService } from '../../../../core/services/paciente';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registroPaciente.html',
  styleUrl: './registroPaciente.css'
})
export class RegistroPaciente {
  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private router = inject(Router);

  pasoActual: number = 1;
  idPacienteCreado: string = '';
  cargando: boolean = false;
  mensajeError: string = '';

  // Formulario Paso 1: Mapea exactamente con UsuarioDTO
  usuarioForm: FormGroup = this.fb.group({
    idUsuario: [this.generarUUID()], // Generador temporal para pasar el @NotNull
    cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    nombres: ['', [Validators.required, Validators.maxLength(50)]],
    apellidos: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    rol: ['PACIENTE', Validators.required] // Hardcodeado porque es el registro de pacientes
  });

  // Formulario Paso 2: Mapea exactamente con PacientePerfilDTO
  perfilForm: FormGroup = this.fb.group({
    idPaciente: [''], 
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
      
      this.pacienteService.registrarUsuario(this.usuarioForm.value).subscribe({
        next: (respuesta: any) => {
          this.idPacienteCreado = respuesta.idUsuario;
          this.perfilForm.patchValue({ idPaciente: this.idPacienteCreado });
          this.pasoActual = 2; // Avanzamos a la siguiente vista visual
          this.cargando = false;
        },
        error: (err) => {
          this.mensajeError = 'Error al registrar usuario. Verifica los datos o la conexión.';
          this.cargando = false;
        }
      });
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  guardarPaso2() {
    if (this.perfilForm.valid) {
      this.cargando = true;
      this.mensajeError = '';

      this.pacienteService.guardarPerfil(this.idPacienteCreado, this.perfilForm.value).subscribe({
        next: () => {
          this.cargando = false;
          alert('¡Paciente y perfil registrados con éxito!');
          this.router.navigate(['/doctor/pacientes']); // Regresa al listado
        },
        error: (err) => {
          this.mensajeError = 'Error al guardar el perfil médico.';
          this.cargando = false;
        }
      });
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }

  // Generador temporal de UUID (Puedes borrarlo cuando tu backend genere el ID)
  private generarUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}