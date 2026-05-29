//core/layout/navbarPanelDoctor/navbarPanelDoctor.ts
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar-panel-doctor',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navbarPanelDoctor.html',
  styleUrl: './navbarPanelDoctor.css'
})
export class NavbarPanelDoctor {

  private authService = inject(AuthService);

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}

