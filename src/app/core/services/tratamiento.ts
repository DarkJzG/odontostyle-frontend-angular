import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TratamientoDTO } from '../models/tratamientoDTO';

@Injectable({ providedIn: 'root' })
export class TratamientoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/tratamientos`;

  listarTodos(): Observable<TratamientoDTO[]> {
    return this.http.get<TratamientoDTO[]>(this.apiUrl);
  }

  crear(tratamiento: TratamientoDTO): Observable<TratamientoDTO> {
    return this.http.post<TratamientoDTO>(this.apiUrl, tratamiento);
  }

  actualizar(id: number, tratamiento: TratamientoDTO): Observable<TratamientoDTO> {
    return this.http.put<TratamientoDTO>(`${this.apiUrl}/${id}`, tratamiento);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //Para el modulo paciente
  obtenerTratamientosActivos(): Observable<TratamientoDTO[]> {
    return this.http.get<TratamientoDTO[]>(`${this.apiUrl}`);
  }
}