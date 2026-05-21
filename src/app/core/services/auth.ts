import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // 1. Añadimos HttpClient para poder consultar tu base de datos
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  // === LOGIN DINÁMICO (CÉDULA O CORREO) ===
  iniciarSesion(credenciales: any): Observable<any> {
    const { username, password } = credenciales; // 'username' recibe lo que escribas en la caja de texto
    
    // 1. Angular analiza: ¿Tiene un arroba '@'?
    const esCorreo = username.includes('@');
    
    // 2. Arma la URL dinámica
    const urlPeticion = esCorreo 
      ? `${this.apiUrl}/buscar-correo?email=${username}` 
      : `${this.apiUrl}/buscar?cedula=${username}`;

    console.log(`Intentando login por ${esCorreo ? 'CORREO' : 'CÉDULA'} con:`, username);

    // 3. Dispara la petición a tu backend
    return this.http.get<any>(urlPeticion).pipe(
      tap((usuarioReal) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('id_usuario_real', usuarioReal.idUsuario);
          localStorage.setItem('rol_usuario_real', usuarioReal.rol);
        }
      }),
      map((usuarioReal) => {
        return { token: `fake-jwt-token-${usuarioReal.rol.toLowerCase()}` };
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => new Error('Credenciales inválidas o el usuario no existe en la BD'));
      })
    );
  }

  // === MÉTODOS ACTUALIZADOS PARA EVITAR EL ERROR DEL SERVIDOR (SSR) ===

  guardarToken(token: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('jwt_token', token);
    }
  }

  obtenerToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('jwt_token');
    }
    return null; 
  }

  // Ahora leemos el rol real que nos devolvió PostgreSQL
  obtenerRolUsuario(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('rol_usuario_real');
    }
    return null;
  }

  cerrarSesion() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('id_usuario_real'); // Limpiamos el ID real al salir
      localStorage.removeItem('rol_usuario_real'); // Limpiamos el rol real al salir
    }
  }

  // === AHORA DEVUELVE EL ID DINÁMICO DE POSTGRESQL ===
  obtenerIdUsuarioLogueado(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('id_usuario_real') || ''; // Devuelve el UUID exacto de quien inició sesión
    }
    return ''; 
  }
}