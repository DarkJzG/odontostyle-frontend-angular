import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // 1. Identificador de plataforma (Tu enfoque limpio para SSR)
  private platformId = inject(PLATFORM_ID);
  
  // 2. Cliente HTTP para consultar la BD (El enfoque de Anderson)
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  // === LOGIN DINÁMICO (CÉDULA O CORREO PARA CUALQUIER ROL) ===
  iniciarSesion(credenciales: any): Observable<any> {
    const { username, password } = credenciales; 
    
    // Analiza si el input tiene '@' para saber a qué endpoint del backend llamar
    const esCorreo = username.includes('@');
    const urlPeticion = esCorreo 
      ? `${this.apiUrl}/buscar-correo?email=${username}` 
      : `${this.apiUrl}/buscar?cedula=${username}`;

    console.log(`Intentando login por ${esCorreo ? 'CORREO' : 'CÉDULA'} con:`, username);

    // Dispara la petición al backend en Java
    return this.http.get<any>(urlPeticion).pipe(
      tap((usuarioReal) => {
        // Usamos tu validación de plataforma antes de tocar el localStorage
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('id_usuario_real', usuarioReal.idUsuario);
          localStorage.setItem('rol_usuario_real', usuarioReal.rol);
        }
      }),
      map((usuarioReal) => {
        // Retorna un token simulado basado en el rol real de la BD
        return { token: `fake-jwt-token-${usuarioReal.rol.toLowerCase()}` };
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => new Error('Credenciales inválidas o el usuario no existe en la BD'));
      })
    );
  }

  // === GESTIÓN SEGURA DEL LOCAL STORAGE ===

  guardarToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('jwt_token', token);
    }
  }

  obtenerToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  obtenerRolUsuario(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('rol_usuario_real');
    }
    return null;
  }

  obtenerIdUsuarioLogueado(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('id_usuario_real') || ''; 
    }
    return ''; 
  }

  cerrarSesion() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('id_usuario_real'); 
      localStorage.removeItem('rol_usuario_real'); 
    }
  }
}