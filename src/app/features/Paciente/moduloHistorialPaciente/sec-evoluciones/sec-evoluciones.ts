import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CitaService } from '../../../../core/services/cita';
import { EvolucionService } from '../../../../core/services/evolucion';
import { EvolucionDTO } from '../../../../core/models/evolucionDTO';

@Component({
  selector: 'app-sec-evoluciones',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sec-evoluciones.html',
  styleUrl: './sec-evoluciones.css'
})
export class SecEvoluciones implements OnInit {
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

  cargarCitasAtendidas() {
    this.cargandoLista = true;
    this.citaService.obtenerCitasPorPaciente(this.idUsuario).subscribe({
      next: (data) => {
        // Filtramos solo las completadas para que el paciente vea las notas reales
        this.citasCompletadas = data
          .filter((c: any) => c.estado === 'COMPLETADA')
          .sort((a: any, b: any) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime());
        
        this.cargandoLista = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar sesiones del paciente:', err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

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
        alert('Aún no hay notas médicas detalladas registradas para esta sesión.');
      }
    });
  }
}