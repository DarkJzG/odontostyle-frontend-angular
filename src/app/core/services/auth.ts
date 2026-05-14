import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // === MODO DEMO: Simula la validación sin ir al backend ===
  iniciarSesion(credenciales: any): Observable<any> {
    const { username, password } = credenciales;

    // Si escribe "doctor" y la contraseña "123"
    if (username.toLowerCase() === 'doctor' && password === '123') {
      return of({ token: 'fake-jwt-token-doctor' }).pipe(delay(800)); // delay simula el tiempo de carga
    } 
    // Si escribe "paciente" y la contraseña "123"
    else if (username.toLowerCase() === 'paciente' && password === '123') {
      return of({ token: 'fake-jwt-token-paciente' }).pipe(delay(800));
    }

    return throwError(() => new Error('Credenciales inválidas'));
  }

  guardarToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // En lugar de descodificar un JWT real, leemos el token falso que inventamos arriba
  obtenerRolUsuario(): string | null {
    const token = this.obtenerToken();
    if (!token) return null;

    if (token === 'fake-jwt-token-doctor') return 'DOCTOR';
    if (token === 'fake-jwt-token-paciente') return 'PACIENTE';
    
    return null;
  }

  cerrarSesion() {
    localStorage.removeItem('jwt_token');
  }
}