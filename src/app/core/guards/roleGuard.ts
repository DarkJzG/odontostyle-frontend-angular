// core/guards/role.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Obtenemos qué rol exige la ruta a la que intenta entrar
  const rolesPermitidos = route.data['roles'] as Array<string>;
  const rolUsuario = authService.obtenerRolUsuario();

  // Si tiene token y su rol está en la lista de permitidos, pasa
  if (rolUsuario && rolesPermitidos.includes(rolUsuario)) {
    return true;
  }

  // Si no tiene permisos, lo pateamos de vuelta al login
  router.navigate(['/login']);
  return false;
};