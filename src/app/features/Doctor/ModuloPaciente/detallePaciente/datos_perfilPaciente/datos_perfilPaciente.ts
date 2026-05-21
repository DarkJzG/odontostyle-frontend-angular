import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PacienteService } from '../../../../../core/services/paciente'; 

@Component({
  selector: 'app-datos-perfil-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './datos_perfilPaciente.html',
  styleUrl: './datos_perfilPaciente.css'
})
export class DatosPerfilPaciente {
  // Recibimos los datos del componente padre
  @Input() paciente: any;
  @Input() perfilMedico: any;

  private pacienteService = inject(PacienteService);
  private cdr = inject(ChangeDetectorRef);

  guardando: boolean = false;

  copiarId() {
    if (this.paciente?.idUsuario) {
      navigator.clipboard.writeText(this.paciente.idUsuario).then(() => {
        console.log('ID copiado al portapapeles');
        // Aquí podrías agregar un pequeño aviso visual si lo deseas
      }).catch((err: any) => {
        console.error('Error al copiar el ID', err);
      });
    }
  }

  guardarCambios() {
    if (!this.paciente?.idUsuario) return;
    
    this.guardando = true;
    
    const payload = {
      paciente: this.paciente,
      perfilMedico: this.perfilMedico
    };

    this.pacienteService.actualizarDetalle(this.paciente.idUsuario, payload).subscribe({
      next: (res: any) => {
        this.guardando = false;
        // Actualizamos los objetos locales con la respuesta
        this.paciente = res.paciente;
        this.perfilMedico = res.perfilMedico;
        this.cdr.detectChanges();
        alert('Cambios guardados correctamente');
      },
      error: (err: any) => {
        this.guardando = false;
        
        if (err.status === 400) {
          alert('Por favor, complete todos los campos obligatorios (Ej: Grupo Sanguíneo y Motivo de Consulta).');
        } else {
          alert('Error al guardar los cambios');
        }
        
        console.error('Error al guardar los cambios', err);
        this.cdr.detectChanges();
      }
    });
  }
}