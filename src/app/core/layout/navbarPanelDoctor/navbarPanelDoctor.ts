import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-panel-doctor',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navbarPanelDoctor.html',
  styleUrl: './navbarPanelDoctor.css'
})
export class NavbarPanelDoctor {
  private router = inject(Router);

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}