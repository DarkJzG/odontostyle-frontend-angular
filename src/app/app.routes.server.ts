
//src/app/app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 1. Las rutas privadas se procesan SOLO en el navegador del usuario (Donde vive Keycloak)
  {
    path: 'doctor/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'paciente/**',
    renderMode: RenderMode.Client
  },
  // 2. El resto de la web (Tu Landing Page pública) sí se pre-renderiza para que cargue ultra rápido
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
