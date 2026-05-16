import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-panel-paciente',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navbarPanelPaciente.html',
  styleUrl: './navbarPanelPaciente.css'
})
export class NavbarPanelPaciente {
  private router = inject(Router);

  nombrePaciente: string = 'Anderson';

  cerrarSesion() {
    // Si estás usando localStorage, puedes limpiarlo aquí
    // localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}