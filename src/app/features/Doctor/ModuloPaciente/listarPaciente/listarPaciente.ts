//features/Doctor/ModuloPaciente/listarPaciente/listarPaciente.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from '../../../../core/services/usuario'; 
import { UsuarioDTO } from '../../../../core/models/usuarioDTO'; 
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';

@Component({
  selector: 'app-lista-pacientes',
  standalone: true,
  imports: [CommonModule, MatIcon, NavbarPanelDoctor],
  templateUrl: './listarPaciente.html',
  styleUrl: './listarPaciente.css'  
})
export class ListaPaciente implements OnInit {

  private router = inject(Router);
  private usuarioService = inject(UsuarioService); // <-- Inyectamos el servicio correcto
  private cdr = inject(ChangeDetectorRef);

  pacientes: UsuarioDTO[] = []; 
  pacientesFiltrados: UsuarioDTO[] = [];
  cargando: boolean = false;
  terminoBusqueda: string = '';

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.cargando = true;
    this.usuarioService.listarUsuarios().subscribe({
      next: (data: UsuarioDTO[]) => {
        this.pacientes = data.filter(u => u.rol === 'PACIENTE');
        this.pacientesFiltrados = this.pacientes;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar pacientes desde PostgreSQL', err);
        this.cargando = false;
        this.cdr.detectChanges(); // Siempre actualizar la vista aunque falle
      }
    });
  }

  irARegistroNuevo() {
    this.router.navigate(['/doctor/pacientes/registro']);
  }

  irAPerfilMedico(id: string) {
    this.router.navigate([`/doctor/pacientes/${id}/perfil`]);
  }

  eliminarPaciente(id: string, nombres: string) {
    if (confirm(`¿Eliminar permanentemente a ${nombres}? Esta acción no se puede deshacer.`)) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.pacientes = this.pacientes.filter(p => p.id !== id);
          this.pacientesFiltrados = this.pacientesFiltrados.filter(p => p.id !== id);
          this.cdr.detectChanges();
          alert('Paciente eliminado correctamente.');
        },
        error: (err: any) => {
          console.error('Error al eliminar paciente', err);
          alert('No se pudo eliminar el paciente. Verifique que no tenga citas asociadas.');
        }
      });
    }
  }

  verDetallePaciente(id: string) {
    this.router.navigate([`/doctor/historias/${id}`]);
  } 

  editarPaciente(id: string) {
    this.router.navigate([`/doctor/pacientes/${id}/editar`]);
  }

  buscarPaciente(cedula: string) {
    this.terminoBusqueda = cedula.trim();

    if (!this.terminoBusqueda) {
      this.pacientesFiltrados = [...this.pacientes];
      return;
    }

    // 1. Intento de filtrado rápido en la lista local cargada
    const resultadoLocal = this.pacientes.filter(p => p.cedula.includes(this.terminoBusqueda));

    if (resultadoLocal.length > 0) {
      this.pacientesFiltrados = resultadoLocal;
    } else {
      // 2. Si no está en memoria, disparamos la consulta directa al endpoint por cédula
      this.cargando = true;
      this.usuarioService.obtenerPorCedula(this.terminoBusqueda).subscribe({
        next: (pacienteEncontrado: UsuarioDTO) => {
          if (pacienteEncontrado.rol === 'PACIENTE') {
            this.pacientesFiltrados = [pacienteEncontrado];
          } else {
            this.pacientesFiltrados = [];
          }
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.warn('Búsqueda sin resultados en el servidor', err);
          this.pacientesFiltrados = [];
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  limpiarBuscador(input: HTMLInputElement) {
    input.value = '';
    this.terminoBusqueda = '';
    this.pacientesFiltrados = [...this.pacientes];
    this.cdr.detectChanges();
  }

  volverPagHome() {
    this.router.navigate(['/doctor']);
  }
}
