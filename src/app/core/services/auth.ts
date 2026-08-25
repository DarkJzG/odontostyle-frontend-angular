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
    return `${tokenParsed?.['given_name'] || ''} ${tokenParsed?.['family_name'] || ''}`.trim() || 'Usuario';
  }

  obtenerEmailUsuario(): string {
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
    return tokenParsed?.['email'] || '';
  }

  obtenerIdUsuarioLogueado(): string {
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
    return tokenParsed?.sub || ''; 
  }

  obtenerDatosCompletosToken() {
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
    return {
      keycloakId: tokenParsed?.sub || '',
      email: tokenParsed?.['email'] || '',
      nombre: tokenParsed?.['given_name'] || 'Usuario',
      apellido: tokenParsed?.['family_name'] || 'Registrado',
      username: tokenParsed?.['preferred_username'] || ''
    };
  }
}