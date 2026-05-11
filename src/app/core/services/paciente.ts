import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl;


  //Registrar el Usuario tipo Paciente
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario);
  }

  //Actualizar el Usuario tipo Paciente
  actualizarUsuario(idUsuario: string, usuario: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${idUsuario}`, usuario);
  }

  //Eliminar el Usuario tipo Paciente
  eliminarUsuario(idUsuario: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${idUsuario}`);
  }

  //Buscar el Usuario tipo Paciente
  buscarUsuario(idUsuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/${idUsuario}`);
  }

  //Listar todos los Usuarios tipo Paciente
  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  //Guardar el Perfil del Paciente
  guardarPerfil(idUsuario: string, perfil: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pacientes/${idUsuario}/perfil`, perfil);
  }
  
  //Obtener el Perfil del Paciente
  obtenerPerfil(idUsuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pacientes/${idUsuario}/perfil`);
  }
}
