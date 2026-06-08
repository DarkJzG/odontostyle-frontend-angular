// src/app/core/services/plantilla.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlantillaDocumentoDTO } from '../models/plantillaDTO';

@Injectable({
  providedIn: 'root'
})
export class PlantillaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/plantillas`;

  listarPlantillas(): Observable<PlantillaDocumentoDTO[]> {
    return this.http.get<PlantillaDocumentoDTO[]>(this.apiUrl);
  }

  crearPlantilla(dto: PlantillaDocumentoDTO): Observable<PlantillaDocumentoDTO> {
    return this.http.post<PlantillaDocumentoDTO>(this.apiUrl, dto);
  }

  actualizarPlantilla(id: string, dto: PlantillaDocumentoDTO): Observable<PlantillaDocumentoDTO> {
    return this.http.put<PlantillaDocumentoDTO>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarPlantilla(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}