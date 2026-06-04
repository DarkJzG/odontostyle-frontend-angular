// features/Doctor/ModuloHistoriasClinicas/tab-historial/tab-historial.ts
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CitaService } from '../../../../core/services/cita';

@Component({
  selector: 'app-tab-historial',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tab-historial.html',
  styleUrl: './tab-historial.css'
})
export class TabHistorial implements OnInit {
  @Input() idUsuario: string = '';
  
  private citaService = inject(CitaService);
  private cdr = inject(ChangeDetectorRef);

  citas: any[] = [];
  cargando: boolean = true;

  ngOnInit() {
    if (this.idUsuario) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    this.cargando = true;
    this.citaService.obtenerCitasPorPaciente(this.idUsuario).subscribe({
      next: (data) => {
        // Ordenamos para que las más recientes salgan primero
        this.citas = data.sort((a, b) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime());
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar historial de citas:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}