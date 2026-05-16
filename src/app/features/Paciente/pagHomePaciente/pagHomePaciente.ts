import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';

@Component({
  selector: 'app-pag-home-paciente',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarPanelPaciente], // Agrega NavbarPanelPaciente cuando lo tengas
  templateUrl: './pagHomePaciente.html',
  styleUrl: './pagHomePaciente.css'
})
export class PagHomePaciente implements OnInit {
  
  // Simulamos los datos del paciente logueado
  nombrePaciente: string = 'Anderson'; 
  
  // Simulamos la próxima cita
  proximaCita = {
    fecha: '18 de Mayo, 2026',
    hora: '10:00 AM',
    doctor: 'Dr. Fernando López',
    tratamiento: 'Limpieza Dental',
    estado: 'Confirmada'
  };

  modulos = [
    { nombre: 'Agendar Cita', icono: 'event_available', ruta: '/paciente/agendar' },
    { nombre: 'Mis Citas', icono: 'calendar_month', ruta: '/paciente/citas' },
    { nombre: 'Mi Historial', icono: 'history', ruta: '/paciente/historial' },
    { nombre: 'Mi Perfil', icono: 'person', ruta: '/paciente/perfil' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navegarModulo(ruta: string, nombre: string) {
    if (ruta) {
      this.router.navigate([ruta]);
    } else {
      alert(`El módulo de ${nombre} estará disponible pronto.`);
    }
  }
}