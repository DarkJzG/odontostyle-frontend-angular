//core/services/usuario.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioDTO } from '../models/usuarioDTO'; // Importamos el molde que creamos arriba

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // 1. Inyectamos la herramienta para hacer peticiones HTTP
  private http = inject(HttpClient);

  // 2. Apuntamos a la URL de tu controlador en Spring Boot
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  // --- MÉTODOS QUE HABLAN CON TU BACKEND ---

  listarUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/${id}`);
  }

  obtenerPorCedula(cedula: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/buscar?cedula=${cedula}`);
  }

  crearUsuario(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: string, usuario: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerListaDoctores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lista/doctores`);
  }

}