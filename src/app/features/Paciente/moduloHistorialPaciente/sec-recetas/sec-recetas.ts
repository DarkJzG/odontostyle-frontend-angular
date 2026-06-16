import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CitaService } from '../../../../core/services/cita';
import { EvolucionService } from '../../../../core/services/evolucion';

@Component({
  selector: 'app-sec-recetas',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sec-recetas.html',
  styleUrl: './sec-recetas.css'
})
export class SecRecetas implements OnInit {
  @Input() idUsuario: string = '';
  @Input() paciente: any = null; // Recibe los datos desde el componente padre
  
  private citaService = inject(CitaService);
  private evolucionService = inject(EvolucionService);
  private cdr = inject(ChangeDetectorRef);

  citasCompletadas: any[] = [];
  recetaSeleccionada: string | null = null;
  fechaReceta: string | null = null;
  nombreDoctorAtencion: string = '';
  
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
        this.citasCompletadas = data
          .filter((c: any) => c.estado === 'COMPLETADA')
          .sort((a: any, b: any) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime());
        
        this.cargandoLista = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar consultas para recetas:', err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Ahora pasamos el objeto "cita" completo para extraer el nombre del doctor que lo atendió ese día
  verReceta(citaId: string, cita: any) {
    this.cargandoDetalle = true;
    this.recetaSeleccionada = null;
    this.fechaReceta = cita.fechaHoraInicio;
    
    // Asignamos el nombre del doctor que atendió esta cita en particular
    this.nombreDoctorAtencion = cita.doctorNombres ? `${cita.doctorNombres} ${cita.doctorApellidos}` : 'OdontoStyle';
    
    this.cdr.detectChanges();

    this.evolucionService.obtenerPorCita(citaId).subscribe({
      next: (evo) => {
        if (evo.prescripcionMedica && evo.prescripcionMedica.trim().length > 0) {
          this.recetaSeleccionada = evo.prescripcionMedica;
        } else {
          this.recetaSeleccionada = 'NO_APLICA'; 
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
    window.print();
  }
}