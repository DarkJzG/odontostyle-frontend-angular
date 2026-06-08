// features/Doctor/ModuloHistoriasClinicas/tab-evoluciones/tab-evoluciones.ts
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CitaService } from '../../../../core/services/cita';
import { EvolucionService } from '../../../../core/services/evolucion';
import { EvolucionDTO } from '../../../../core/models/evolucionDTO';

@Component({
  selector: 'app-tab-evoluciones',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tab-evoluciones.html',
  styleUrl: './tab-evoluciones.css'
})
export class TabEvoluciones implements OnInit {
  @Input() idUsuario: string = '';
  
  private citaService = inject(CitaService);
  private evolucionService = inject(EvolucionService);
  private cdr = inject(ChangeDetectorRef);

  citasCompletadas: any[] = [];
  evolucionSeleccionada: EvolucionDTO | null = null;
  
  cargandoLista: boolean = true;
  cargandoDetalle: boolean = false;

  ngOnInit() {
    if (this.idUsuario) {
      this.cargarCitasAtendidas();
    }
  }

  // Solo traemos citas que el doctor haya marcado como "COMPLETADA"
  cargarCitasAtendidas() {
    this.cargandoLista = true;
    this.citaService.obtenerCitasPorPaciente(this.idUsuario).subscribe({
      next: (data) => {
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

  // Cuando el doctor hace clic en una fecha, buscamos la hoja clínica de ese día
  verNotaMedica(citaId: string) {
    this.cargandoDetalle = true;
    this.evolucionSeleccionada = null;
    this.cdr.detectChanges();

    this.evolucionService.obtenerPorCita(citaId).subscribe({
      next: (evo) => {
        this.evolucionSeleccionada = evo;
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
        alert('No se encontró el registro de evolución detallado para esta sesión.');
      }
    });
  }
}