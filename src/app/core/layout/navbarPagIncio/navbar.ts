//core/layout/navbarPagIncio/navbar.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar {

  menuAbierto: boolean = false;
  
  private router = inject(Router);
  private authService = inject(AuthService);

  //funcion para abrir y cerrar el menu
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  irALogin() {
    this.menuAbierto = false;
    this.authService.iniciarSesion(); // <-- Llama directo a Keycloak
  }

  irAInicio() {
    this.menuAbierto = false;
    this.router.navigate(['/']);
  }
  
  cerrarSesion() {
    this.menuAbierto = false;
    this.authService.cerrarSesion();
  }
}