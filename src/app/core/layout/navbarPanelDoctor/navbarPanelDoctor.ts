//core/layout/navbarPanelDoctor/navbarPanelDoctor.ts
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-panel-doctor',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navbarPanelDoctor.html',
  styleUrl: './navbarPanelDoctor.css'
})
export class NavbarPanelDoctor {

  private authService = inject(AuthService);
  private router = inject(Router);


  nombreDoctor: string = '';
  menuAbierto: boolean = false;

  ngOnInit() {
    if (this.authService.estaLogueado()) {
      this.nombreDoctor = this.authService.obtenerNombreUsuario();
    }
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}

