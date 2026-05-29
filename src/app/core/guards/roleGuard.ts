import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // 1. Si no hay token en absoluto, lo mandamos a Keycloak a loguearse
  if (!authService.estaLogueado()) {
    authService.iniciarSesion();
    return false;
  }

  // 2. Obtenemos qué roles exige la ruta (Ej: ['DOCTOR', 'ASISTENTE'])
  const rolesPermitidos = route.data['roles'] as Array<string>;
  
  // 3. Obtenemos los roles que tiene el usuario según Keycloak
  const rolesUsuario = authService.obtenerRolesUsuario();

  // 4. Verificamos si el usuario tiene al menos UNO de los roles permitidos
  const tienePermiso = rolesPermitidos.some(rol => rolesUsuario.includes(rol));

  if (tienePermiso) {
    return true; // ¡Pasa adelante!
  }

  // Si está logueado pero no tiene el rol correcto (Ej: un paciente intentando entrar a /doctor)
  router.navigate(['/']); 
  return false;
};