import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../../../core/layout/navbarPagIncio/navbar';
import { Footer } from '../../../../core/layout/footer/footer';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [Navbar, Footer],
  templateUrl: './inicioPag.html',
  styleUrl: './inicioPag.css'
})
export class Inicio implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Si ya tiene sesión en Keycloak, lo mandamos directo a su panel
    if (this.authService.estaLogueado()) {
      this.enrutarPorRol();
    }
  }

  private enrutarPorRol() {
    const roles = this.authService.obtenerRolesUsuario();
    if (roles.includes('DOCTOR') || roles.includes('ASISTENTE')) {
      this.router.navigate(['/doctor/home']);
    } else if (roles.includes('PACIENTE')) {
      this.router.navigate(['/paciente/home']);
    }
  }
}