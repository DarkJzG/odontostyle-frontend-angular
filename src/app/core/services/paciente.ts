//core/services/paciente.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// Importa tus DTOs aquí: DetallePacienteDTO, OdontogramaDTO, etc.

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private http = inject(HttpClient);
  // Asegúrate de que la ruta base coincida con tu backend (ej. /api/pacientes)
  private baseUrl = environment.apiUrl; 

  // --- SOLO LÓGICA CLÍNICA Y COMPUESTA ---

  // Obtener el Perfil Médico
  obtenerPerfil(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/pacientes/${id}/perfil`);
  }

  // Guardar el Perfil Médico
  guardarPerfil(id: string, perfil: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/pacientes/${id}/perfil`, perfil);
  }

  // Obtener el Detalle Completo (Usuario + Perfil)
  obtenerDetalle(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/usuarios/${id}/detalle`);
  }

  // Actualizar el Usuario y el Perfil del Paciente a la vez
  actualizarDetalle(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/usuarios/${id}/detalle`, payload);
  }

  // --- ODONTOGRAMA ---

  registrarEstadoOdontograma(id: string, estado: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/odontogramas/pacientes/${id}`, estado);
  }

  obtenerOdontogramaActual(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/odontogramas/pacientes/${id}/actual`);
  }

  obtenerHistorialOdontograma(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/odontogramas/pacientes/${id}`);
  }
}