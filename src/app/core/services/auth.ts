<<<<<<< HEAD
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
=======
import { Injectable, inject } from '@angular/core';
>>>>>>> origin/PanelPaciente
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
<<<<<<< HEAD
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
=======
  // 1. Añadimos HttpClient para poder consultar tu base de datos
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  // === LOGIN DINÁMICO (CÉDULA O CORREO) ===
  iniciarSesion(credenciales: any): Observable<any> {
    const { username, password } = credenciales; // 'username' recibe lo que escribas en la caja de texto
    
    // 1. Angular analiza: ¿Tiene un arroba '@'?
    const esCorreo = username.includes('@');
    
    // 2. Arma la URL dinámica
>>>>>>> origin/PanelPaciente
    const urlPeticion = esCorreo 
      ? `${this.apiUrl}/buscar-correo?email=${username}` 
      : `${this.apiUrl}/buscar?cedula=${username}`;

    console.log(`Intentando login por ${esCorreo ? 'CORREO' : 'CÉDULA'} con:`, username);

<<<<<<< HEAD
    // Dispara la petición al backend en Java
    return this.http.get<any>(urlPeticion).pipe(
      tap((usuarioReal) => {
        // Usamos tu validación de plataforma antes de tocar el localStorage
        if (isPlatformBrowser(this.platformId)) {
=======
    // 3. Dispara la petición a tu backend
    return this.http.get<any>(urlPeticion).pipe(
      tap((usuarioReal) => {
        if (typeof window !== 'undefined' && window.localStorage) {
>>>>>>> origin/PanelPaciente
          localStorage.setItem('id_usuario_real', usuarioReal.idUsuario);
          localStorage.setItem('rol_usuario_real', usuarioReal.rol);
        }
      }),
      map((usuarioReal) => {
<<<<<<< HEAD
        // Retorna un token simulado basado en el rol real de la BD
=======
>>>>>>> origin/PanelPaciente
        return { token: `fake-jwt-token-${usuarioReal.rol.toLowerCase()}` };
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => new Error('Credenciales inválidas o el usuario no existe en la BD'));
      })
    );
  }

<<<<<<< HEAD
  // === GESTIÓN SEGURA DEL LOCAL STORAGE ===

  guardarToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
=======
  // === MÉTODOS ACTUALIZADOS PARA EVITAR EL ERROR DEL SERVIDOR (SSR) ===

  guardarToken(token: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
>>>>>>> origin/PanelPaciente
      localStorage.setItem('jwt_token', token);
    }
  }

  obtenerToken(): string | null {
<<<<<<< HEAD
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwt_token');
    }
=======
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
>>>>>>> origin/PanelPaciente
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
<<<<<<< HEAD
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('id_usuario_real'); 
      localStorage.removeItem('rol_usuario_real'); 
    }
=======
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
>>>>>>> origin/PanelPaciente
  }
}