import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    // Agregamos "/agendar" para que coincida con tu @PostMapping("/agendar") en Spring Boot
    return this.http.post<CitaResponseDTO>(`${this.apiUrl}/agendar`, cita);
  }

  // 2. NUEVO: Método para Buscar las citas del paciente (Resuelve el Error 1)
  obtenerCitasPorPaciente(pacienteId: string): Observable<CitaResponseDTO[]> {
    return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // 3. NUEVO: Método para Cancelar (Resuelve el Error 3)
  cancelarCita(idCita: string): Observable<CitaResponseDTO> {
    // Si tu backend espera un PUT para cambiar el estado, enviamos un body vacío {}
    return this.http.put<CitaResponseDTO>(`${this.apiUrl}/${idCita}/cancelar`, {});
  }
}