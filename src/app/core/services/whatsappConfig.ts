//src/app/core/services/whatsappConfig.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class WhatsappConfig {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/configuracion-whatsapp`;

  obtenerConfiguracion(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  guardarConfiguracion(config: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, config);
  }
}
