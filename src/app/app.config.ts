
//src/app/app.config.ts
import { ApplicationConfig, APP_INITIALIZER, PLATFORM_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { KeycloakService, KeycloakBearerInterceptor } from 'keycloak-angular';

// Función protegida que inicializa Keycloak SOLO en el navegador
export function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () => {
    if (isPlatformBrowser(platformId)) {
      return keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'odontostyle-realm',
          clientId: 'angular-frontend'
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        },
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        bearerExcludedUrls: ['/assets', '/silent-check-sso.html']
      });
    }
    return Promise.resolve(); // Si está renderizando en el servidor, lo saltamos
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Mantenemos tu configuración original
    provideRouter(routes), // Mantenemos tus rutas
    provideClientHydration(withEventReplay()), // Mantenemos el SSR intacto
    
    // Fusionamos tus configuraciones HTTP con las necesidades de Keycloak
    provideHttpClient(withFetch(), withInterceptorsFromDi()), 
    
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID] // Inyectamos PLATFORM_ID para que la función sepa dónde está corriendo
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
};