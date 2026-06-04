// src/app/core/services/evolucion.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EvolucionDTO } from '../models/evolucionDTO';

@Injectable({
  providedIn: 'root'
})
export class EvolucionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/evoluciones`;

  registrarEvolucion(evolucion: EvolucionDTO): Observable<EvolucionDTO> {
    return this.http.post<EvolucionDTO>(this.apiUrl, evolucion);
  }

  obtenerPorCita(citaId: string): Observable<EvolucionDTO> {
    return this.http.get<EvolucionDTO>(`${this.apiUrl}/cita/${citaId}`);
  }
}