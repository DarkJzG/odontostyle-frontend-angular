//src/app/core/services/horarioDoctor.ts
import { Injectable, inject } from '@angular/core';
import { HorarioDoctorDTO } from '../models/horarioDoctorDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class HorarioDoctorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/horarios-doctor`;

  guardarHorario(horario: HorarioDoctorDTO): Observable<HorarioDoctorDTO> {
    return this.http.post<HorarioDoctorDTO>(this.apiUrl, horario);
  }
  
  obtenerHorariosPorDoctor(id: string): Observable<HorarioDoctorDTO[]> {
    return this.http.get<HorarioDoctorDTO[]>(`${this.apiUrl}/doctor/${id}`);
  }
  
  eliminarHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/horarios-doctor/${id}`);
  }

  // --- AUSENCIAS Y FERIADOS (DISPONIBILIDAD) ---
  crearAusencia(ausencia: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/disponibilidad`, ausencia);
  }

  obtenerAusencias(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/disponibilidad`);
  }

  eliminarAusencia(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/disponibilidad/${id}`);
  }

}
