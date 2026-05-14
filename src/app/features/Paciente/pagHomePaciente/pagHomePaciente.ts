import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // 1. Agregamos RouterModule

@Component({
  selector: 'app-pag-home-paciente',
  standalone: true, // Asegúrate de que tenga esto si es un componente independiente
  imports: [
    CommonModule, 
    RouterModule // 2. Cambiamos Router por RouterModule aquí
  ],
  templateUrl: './pagHomePaciente.html',
  styleUrl: './pagHomePaciente.css',
})
export class PagHomePaciente implements OnInit {

  // 3. Si necesitas usar el Router para navegar desde el código (.ts)
  // lo inyectas en el constructor:
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Lógica inicial
  }

  // Ejemplo de uso del servicio Router
  irALogin() {
    this.router.navigate(['/login']);
  }
}