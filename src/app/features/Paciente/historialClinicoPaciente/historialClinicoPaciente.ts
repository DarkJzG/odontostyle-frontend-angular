
//features/Paciente/historialClinicoPaciente/historialClinicoPaciente.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

@Component({
  selector: 'app-historial-clinico-paciente',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelPaciente],
  templateUrl: './historialClinicoPaciente.html',
  styleUrl: './historialClinicoPaciente.css'
})
export class HistorialClinicoPaciente {
  private router = inject(Router);

  // CORRECCIÓN: 'pestaña' a 'pestana'
  pestanaActiva: 'consultas' | 'recetas' | 'radiografias' = 'consultas';

  consultas = [
    { id: 101, fecha: '2026-04-10', doctor: 'Dra. María Elena', tratamiento: 'Blanqueamiento', diagnostico: 'Dientes con leve decoloración por café. Encías sanas.', notas: 'Procedimiento realizado sin dolor. Paciente muy cooperativo.' },
    { id: 98, fecha: '2026-01-15', doctor: 'Dr. Roberto Sánchez', tratamiento: 'Consulta General', diagnostico: 'Caries superficial en pieza 14.', notas: 'Se recomienda agendar cita para calce (resina).' },
    { id: 45, fecha: '2025-11-05', doctor: 'Dra. María Elena', tratamiento: 'Limpieza Dental', diagnostico: 'Acumulación de sarro moderado en molares inferiores.', notas: 'Limpieza con ultrasonido completada.' }
  ];

  // CORRECCIÓN: 'tamaño' a 'tamano'
  recetas = [
    { id: 1, fecha: '2026-04-10', doctor: 'Dra. María Elena', archivo: 'Receta_Blanqueamiento_Abril.pdf', tamano: '1.2 MB' },
    { id: 2, fecha: '2026-01-15', doctor: 'Dr. Roberto Sánchez', archivo: 'Receta_Analgésicos.pdf', tamano: '0.8 MB' }
  ];

  radiografias = [
    { id: 1, fecha: '2025-11-05', tipo: 'Panorámica', archivo: 'Rx_Panoramica_Nov2025.jpg', tamano: '4.5 MB' }
  ];

  volver() {
    this.router.navigate(['/paciente/home']);
  }

  // CORRECCIÓN: Función renombrada
  cambiarPestana(pestana: 'consultas' | 'recetas' | 'radiografias') {
    this.pestanaActiva = pestana;
  }

  descargarArchivo(nombreArchivo: string) {
    alert(`Iniciando descarga de: ${nombreArchivo}\n(Esta función se conectará al backend para descargar el archivo real)`);
  }
}