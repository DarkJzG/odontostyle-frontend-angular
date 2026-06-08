//src/app/core/services/auth.ts
import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private keycloak = inject(KeycloakService);

  iniciarSesion() {
      this.keycloak.login({
        redirectUri: window.location.origin + '/'
      });
  }

  cerrarSesion() {
    // Redirige al login de Keycloak para limpiar sesión, y luego vuelve a la raíz de tu app
    this.keycloak.logout(window.location.origin);
  }

  estaLogueado(): boolean {
    return this.keycloak.isLoggedIn();
  }

  obtenerRolesUsuario(): string[] {
    return this.keycloak.getUserRoles();
  }

  obtenerNombreUsuario(): string {
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
    return tokenParsed?.['given_name'] + ' ' + tokenParsed?.['family_name'] || 'Usuario';
  }
  obtenerIdUsuarioLogueado(): string {
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
    return tokenParsed?.sub || ''; 
  }
}