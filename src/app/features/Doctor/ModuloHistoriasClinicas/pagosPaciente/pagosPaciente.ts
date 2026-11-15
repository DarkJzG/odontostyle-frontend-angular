// features/Doctor/ModuloHistoriasClinicas/pagosPaciente/pagosPaciente.ts
// ODO-40: acceso a Pagos para DOCTOR y ASISTENTE sin abrir la historia clínica completa.
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { UsuarioService } from '../../../../core/services/usuario';
import { TabPagos } from '../tab-pagos/tab-pagos';

@Component({
  selector: 'app-pagos-paciente',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelDoctor, TabPagos],
  templateUrl: './pagosPaciente.html',
  styleUrl: './pagosPaciente.css'
})
export class PagosPaciente implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  idUsuario = '';
  nombrePaciente = '';
  cedula = '';

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.paramMap.get('id') || '';
    if (!this.idUsuario) {
      return;
    }
    this.usuarioService.obtenerPorId(this.idUsuario).subscribe({
      next: (u: any) => {
        this.nombrePaciente = `${u.nombres ?? ''} ${u.apellidos ?? ''}`.trim();
        this.cedula = u.cedula ?? '';
        this.cdr.detectChanges();
      },
      error: () => { this.nombrePaciente = 'Paciente'; this.cdr.detectChanges(); }
    });
  }

  volver() {
    this.router.navigate(['/doctor/pacientes']);
  }
}
