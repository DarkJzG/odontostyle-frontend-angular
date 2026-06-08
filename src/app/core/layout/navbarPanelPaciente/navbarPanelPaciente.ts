import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar-panel-paciente',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbarPanelPaciente.html',
  styleUrl: './navbarPanelPaciente.css'
})
export class NavbarPanelPaciente implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  nombrePaciente: string = '';
  menuAbierto: boolean = false;

  ngOnInit() {
    if (this.authService.estaLogueado()) {
      this.nombrePaciente = this.authService.obtenerNombreUsuario();
    }
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}