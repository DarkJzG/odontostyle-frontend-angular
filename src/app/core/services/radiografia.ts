// src/app/core/services/radiografia.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RadiografiaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/radiografias`;

  // Usamos FormData para empaquetar el archivo binario junto con los textos
  subirRadiografia(idPaciente: string, tipo: string, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('idPaciente', idPaciente);
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);

    return this.http.post(`${this.apiUrl}/subir`, formData);
  }

  obtenerPorPaciente(idPaciente: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${idPaciente}`);
  }
}