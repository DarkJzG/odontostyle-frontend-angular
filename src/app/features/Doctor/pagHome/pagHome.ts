import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelDoctor } from '../../../core/layout/navbarPanelDoctor/navbarPanelDoctor'; 

@Component({
  selector: 'app-pag-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelDoctor], // <-- Agregado aquí
  templateUrl: './pagHome.html',
  styleUrl: './pagHome.css'
})
export class PagHome implements OnInit {
  
  fechaHoy: Date = new Date();

  citasHoy = [
    { hora: '08:30 AM', paciente: 'Carlos Ruiz', tratamiento: 'Limpieza Dental', estado: 'Confirmada' },
    { hora: '10:00 AM', paciente: 'María Fernández', tratamiento: 'Ortodoncia (Control)', estado: 'Pendiente' },
    { hora: '11:15 AM', paciente: 'Luis Torres', tratamiento: 'Extracción', estado: 'Confirmada' },
    { hora: '02:00 PM', paciente: 'Ana Gómez', tratamiento: 'Blanqueamiento', estado: 'Pendiente' },
    { hora: '04:30 PM', paciente: 'Jorge Silva', tratamiento: 'Consulta General', estado: 'Confirmada' }
  ];

  modulos = [
    { nombre: 'Pacientes', icono: 'people', ruta: '/doctor/pacientes' },
    { nombre: 'Agenda', icono: 'calendar_month', ruta: '/doctor/agenda' },
    { nombre: 'Historias Clínicas', icono: 'assignment_ind', ruta: '/doctor/historias' },
    { nombre: 'Tratamientos', icono: 'medical_services', ruta: '/doctor/tratamientos' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navegarModulo(ruta: string, nombre: string) {
    if (ruta) {
      this.router.navigate([ruta]);
    } else {
      alert(`El módulo de ${nombre} se conectará pronto al backend.`);
    }
  }
}