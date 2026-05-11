import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteService } from '../../../../core/services/paciente';

@Component({
  selector: 'app-lista-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listarPaciente.html',
  styleUrl: './listarPaciente.css'
})
export class ListaPaciente implements OnInit {
  private router = inject(Router);
  private pacienteService = inject(PacienteService);

  pacientes: any[] = [];
  cargando: boolean = false;

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.cargando = true;
    this.pacienteService.listarUsuarios().subscribe({
      next: (data) => {
        // Filtramos para mostrar solo pacientes si el backend envía todos los roles
        this.pacientes = data.filter((u: any) => u.rol === 'PACIENTE');
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes desde PostgreSQL', err);
        this.cargando = false;
      }
    });
  }

  irARegistroNuevo() {
    this.router.navigate(['/doctor/pacientes/registro']);
  }

  irAPerfilMedico(idUsuario: string) {
    this.router.navigate([`/doctor/pacientes/${idUsuario}/perfil`]);
  }

  eliminarPaciente(idUsuario: string, nombres: string) {
    if (confirm(`¿Eliminar permanentemente a ${nombres}?`)) {
      this.pacienteService.eliminarUsuario(idUsuario).subscribe({
        next: () => {
          this.pacientes = this.pacientes.filter(p => p.idUsuario !== idUsuario);
          alert('Paciente eliminado correctamente.');
        },
        error: (err) => alert('No se pudo eliminar el paciente.')
      });
    }
  }

  EditarPaciente(idUsuario: string) {
    this.router.navigate([`/doctor/pacientes/${idUsuario}/editar`]);
  }
}
