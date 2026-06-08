//core/services/cita.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CitaRequestDTO, CitaResponseDTO } from '../models/citaDTO';

@Injectable({
  providedIn: 'root'
})

export class CitaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/citas`;

  // === AGENDAR NUEVA CITA ===
  agendarCita(cita: CitaRequestDTO): Observable<CitaResponseDTO> {
    return this.http.post<CitaResponseDTO>(`${this.apiUrl}/agendar`, cita);
  }

  // BUSCAR CITA DE UN PACIENTE
  obtenerCitasPorPaciente(id: string): Observable<CitaResponseDTO[]> {
    return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/paciente/${id}`);
  }

  // CANCELAR CITA
  cancelarCita(id: string): Observable<CitaResponseDTO> {
    return this.http.put<CitaResponseDTO>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  // MOSTRAR CITAS DEL DIA AL DOCTOR
  obtenerCitasDeHoyPorDoctor(doctorId: string): Observable<CitaResponseDTO[]> {
    return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/doctor/${doctorId}/hoy`);
  }

  //MOTOR DE DISPONIBILIDAD (HORAS LIBRES DEL DOCTOR)
  obtenerHorasDisponibles(doctorId: string, fecha: string, tratamientoId: number): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId)
      .set('fecha', fecha)
      .set('tratamientoId', tratamientoId.toString());
    return this.http.get<string[]>(`${this.apiUrl}/disponibles`, { params });
  }

  obtenerCitasPorDoctor(doctorId: string): Observable<CitaResponseDTO[]> {
    return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  cambiarEstadoCita(id: string, estado: string): Observable<CitaResponseDTO> {
    return this.http.put<CitaResponseDTO>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {});
  }
}
