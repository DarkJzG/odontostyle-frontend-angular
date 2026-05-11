import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  // Obtiene el año actual automáticamente
  year: number = new Date().getFullYear();

  constructor(private router: Router) {}

  navegarA(ruta: string) {
    this.router.navigate([ruta]).then(() => {
      window.scrollTo(0, 0); // Sube al inicio de la página al cambiar de vista
    });
  }
}