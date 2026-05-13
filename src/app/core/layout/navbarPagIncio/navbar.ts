import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar {

  menuAbierto: boolean = false;
  
  constructor(private router: Router) {}

  //funcion para abrir y cerrar el menu
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  irALogin() {
    this.menuAbierto = false;
    this.router.navigate(['/login']);
  }

  irAInicio() {
    this.menuAbierto = false;
    this.router.navigate(['/']);
  }
}