// features/Doctor/ModuloHistoriasClinicas/panelHistoria/panelHistoria.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { PacienteService } from '../../../../core/services/paciente';
import { DatosMedicos } from '../tab-datosMedicos/tab-datosMedicos'; 
import { Odontograma } from '../tab-odontograma/tab-odontograma';

@Component({
  selector: 'app-panel-historia',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelDoctor, DatosMedicos, Odontograma],
  templateUrl: './panelHistoria.html',
  styleUrl: './panelHistoria.css'
})
export class PanelHistoria implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pacienteService = inject(PacienteService);
  private cdr = inject(ChangeDetectorRef);

  idUsuario: string = '';
  paciente: any = null;
  perfilMedico: any = null;
  cargando: boolean = true;

  // Unificamos todas las pestañas en un solo nivel
  pestanaActiva: string = 'datos_medicos';

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.paramMap.get('id') || '';
    if (this.idUsuario) {
      this.cargarDatosCompletos();
    }
  }

  cargarDatosCompletos() {
    this.cargando = true;
    this.pacienteService.obtenerDetalle(this.idUsuario).subscribe({
      next: (data: any) => {
        this.paciente = data.paciente;
        this.perfilMedico = data.perfilMedico || {
          idPaciente: '', grupoSanguineo: '', alergias: '', medicamentosHabituales: '', antecedentesFamiliares: '', motivoConsultaInicial: ''
        };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar expediente del paciente', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
  }

  volverAlDirectorio() {
    this.router.navigate(['/doctor/pacientes']);
  }
}