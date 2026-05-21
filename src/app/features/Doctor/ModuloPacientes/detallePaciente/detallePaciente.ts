import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { PacienteService } from '../../../../core/services/paciente';
import { DatosPerfilPaciente } from './datos_perfilPaciente/datos_perfilPaciente';
import { FichaClinica } from './fichaClinica/fichaClinica';

@Component({
  selector: 'app-detalle-paciente',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelDoctor, FormsModule, DatosPerfilPaciente, FichaClinica],
  templateUrl: './detallePaciente.html',
  styleUrl: './detallePaciente.css'
})
export class DetallePaciente implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pacienteService = inject(PacienteService);
  private cdr = inject(ChangeDetectorRef);

  idUsuario: string = '';
  paciente: any = null;
  perfilMedico: any = null;
  cargando: boolean = true;

  
  // Control de las pestañas (Tabs)
  pestanaActiva: string = 'datos_personales';


  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.paramMap.get('id') || '';
    if (this.idUsuario) {
      this.cargarDatosCompletos();
    }
  }

  //cargar datos completos del paciente
  cargarDatosCompletos() {
    this.cargando = true;
    this.pacienteService.obtenerDetalle(this.idUsuario).subscribe({
      next: (data: any) => {
        this.paciente = data.paciente;
        this.perfilMedico = data.perfilMedico || {
          idPaciente: '',
          grupoSanguineo: '',
          alergias: '',
          medicamentosHabituales: '',
          antecedentesFamiliares: '',
          motivoConsultaInicial: ''
        };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar datos del paciente', err);
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