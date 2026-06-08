// features/Doctor/ModuloHistoriasClinicas/tab-recetas/tab-recetas.ts
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CitaService } from '../../../../core/services/cita';
import { EvolucionService } from '../../../../core/services/evolucion';
import { AuthService } from '../../../../core/services/auth';
import { Injectable } from '@angular/core';
import  {Router} from '@angular/router';

@Component({
  selector: 'app-tab-recetas',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tab-recetas.html',
  styleUrl: './tab-recetas.css'
})
export class TabRecetas implements OnInit {
  @Input() idUsuario: string = '';
  @Input() paciente: any = null; // Necesitamos los datos del paciente para la cabecera de la receta
  
  private citaService = inject(CitaService);
  private evolucionService = inject(EvolucionService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  nombreDoctor: string = '';
  citasCompletadas: any[] = [];
  recetaSeleccionada: string | null = null;
  fechaReceta: string | null = null;
  
  cargandoLista: boolean = true;
  cargandoDetalle: boolean = false;

  ngOnInit() {
    if (this.idUsuario) {
      this.cargarCitasAtendidas();
      this.nombreDoctor = this.authService.obtenerNombreUsuario();
    }
  }

  cargarCitasAtendidas() {
    this.cargandoLista = true;
    this.citaService.obtenerCitasPorPaciente(this.idUsuario).subscribe({
      next: (data) => {
        // Traemos las citas completadas
        this.citasCompletadas = data
          .filter(c => c.estado === 'COMPLETADA')
          .sort((a, b) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime());
        
        this.cargandoLista = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

  verReceta(citaId: string, fechaCita: string) {
    this.cargandoDetalle = true;
    this.recetaSeleccionada = null;
    this.fechaReceta = fechaCita;
    this.cdr.detectChanges();

    this.evolucionService.obtenerPorCita(citaId).subscribe({
      next: (evo) => {
        // Extraemos SOLO la prescripción médica de la evolución
        if (evo.prescripcionMedica && evo.prescripcionMedica.trim().length > 0) {
          this.recetaSeleccionada = evo.prescripcionMedica;
        } else {
          this.recetaSeleccionada = 'NO_APLICA'; // Bandera para saber que no hubo receta ese día
        }
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recetaSeleccionada = 'NO_APLICA';
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      }
    });
  }

  imprimirReceta() {
    // La función nativa del navegador para imprimir. 
    // Ocultaremos el resto de la interfaz usando CSS (@media print)
    window.print();
  }
}