import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-panel-paciente',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbarPanelPaciente.html',
  styleUrl: './navbarPanelPaciente.css'
})
export class NavbarPanelPaciente {
  private router = inject(Router);

  nombrePaciente: string = 'Anderson';
  menuAbierto: boolean = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('jwt_token');
    }
    this.router.navigate(['/login']);
  }
}
