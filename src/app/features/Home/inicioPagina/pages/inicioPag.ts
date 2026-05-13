import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../../../core/layout/navbarPagIncio/navbar';
import { Footer } from '../../../../core/layout/footer/footer';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [Navbar, Footer],
  templateUrl: './inicioPag.html',
  styleUrl: './inicioPag.css'
})
export class Inicio {

  constructor(private router: Router) {}

  agendarCita() {
    // Alerta temporal para el Módulo B que hará Anderson
    alert('El portal de agendamiento para pacientes estará disponible muy pronto.');
  }
}