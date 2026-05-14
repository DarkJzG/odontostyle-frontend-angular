import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// Importamos el servicio desde el CORE
import { PacienteService } from '../../../../core/services/paciente';
import { PacientePerfilDTO } from '../../../../core/models/perfilPaciente';

@Component({
  selector: 'app-perfil-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfilPaciente.html',
  styleUrl: './perfilPaciente.css'
})
export class PerfilPaciente implements OnInit {
  perfilForm: FormGroup;
  pacienteIdActual: string = ''; 
  cargando: boolean = false;

  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.perfilForm = this.fb.group({
      grupoSanguineo: ['', [Validators.required, Validators.maxLength(10)]],
      alergias: ['', Validators.maxLength(500)],
      medicamentosHabituales: ['', Validators.maxLength(500)],
      antecedentesFamiliares: ['', Validators.maxLength(500)],
      motivoConsultaInicial: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // 1. Obtenemos el ID de la URL dinámicamente
    this.pacienteIdActual = this.route.snapshot.paramMap.get('id') || '';

    // 2. Si hay un ID válido, intentamos cargar los datos previos del backend
    if (this.pacienteIdActual) {
      this.cargarPerfilExistente();
    }
  }

  cargarPerfilExistente() {
    this.pacienteService.obtenerPerfil(this.pacienteIdActual).subscribe({
      next: (perfil) => {
        if (perfil) {
          // Si el paciente ya tiene historia, llenamos el formulario automáticamente
          this.perfilForm.patchValue(perfil);
        }
      },
      error: (error) => {
        console.log('El paciente aún no tiene un perfil creado o hubo un error.', error);
      }
    });
  }

  guardarPerfil() {
    if (this.perfilForm.valid && this.pacienteIdActual) {
      this.cargando = true;
      const datosPerfil: PacientePerfilDTO = this.perfilForm.value;
      
      this.pacienteService.guardarPerfil(this.pacienteIdActual, datosPerfil)
        .subscribe({
          next: (respuesta) => {
            alert('¡Historia clínica guardada exitosamente en el sistema!');
            this.cargando = false;
          },
          error: (error) => {
            console.error('Ocurrió un error al guardar', error);
            alert('Hubo un error al guardar los datos.');
            this.cargando = false;
          }
        });
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }
}