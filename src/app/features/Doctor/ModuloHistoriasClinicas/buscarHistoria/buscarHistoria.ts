// features/Doctor/ModuloHistoriasClinicas/buscarHistoria/buscarHistoria.ts
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { UsuarioService } from '../../../../core/services/usuario';
import { UsuarioDTO } from '../../../../core/models/usuarioDTO';

@Component({
  selector: 'app-buscar-historia',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelDoctor],
  templateUrl: './buscarHistoria.html',
  styleUrl: './buscarHistoria.css'
})
export class BuscarHistoria {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  terminoBusqueda: string = '';
  pacienteEncontrado: UsuarioDTO | null = null;
  cargando: boolean = false;
  busquedaRealizada: boolean = false;

  // Lógica basada en tu listarPaciente.ts
  buscarPacienteClinico() {
    this.terminoBusqueda = this.terminoBusqueda.trim();
    if (!this.terminoBusqueda) return;

    this.cargando = true;
    this.busquedaRealizada = true;
    this.pacienteEncontrado = null;
    this.cdr.detectChanges();

    // Disparamos la consulta directa al endpoint por cédula
    this.usuarioService.obtenerPorCedula(this.terminoBusqueda).subscribe({
      next: (paciente: UsuarioDTO) => {
        if (paciente.rol === 'PACIENTE') {
          this.pacienteEncontrado = paciente;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.warn('Expediente no encontrado en el servidor', err);
        this.pacienteEncontrado = null;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirExpediente(id: string) {
    this.router.navigate([`/doctor/historias/${id}`]);
  }

  limpiarBuscador() {
    this.terminoBusqueda = '';
    this.busquedaRealizada = false;
    this.pacienteEncontrado = null;
    this.cdr.detectChanges();
  }

  volverPagHome() {
    this.router.navigate(['/doctor']);
  }
}