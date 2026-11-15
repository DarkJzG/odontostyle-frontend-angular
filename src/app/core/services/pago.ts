// src/app/core/services/pago.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrearCuentaRequest, CuentaDTO, RegistrarAbonoRequest, ResumenPagosDTO } from '../models/pagoDTO';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/pagos`;

  obtenerResumenPaciente(pacienteId: string): Observable<ResumenPagosDTO> {
    return this.http.get<ResumenPagosDTO>(`${this.apiUrl}/pacientes/${pacienteId}/cuentas`);
  }

  crearCuenta(request: CrearCuentaRequest): Observable<CuentaDTO> {
    return this.http.post<CuentaDTO>(`${this.apiUrl}/cuentas`, request);
  }

  anularCuenta(cuentaId: string, motivo: string): Observable<CuentaDTO> {
    return this.http.put<CuentaDTO>(`${this.apiUrl}/cuentas/${cuentaId}/anular`, { motivo });
  }

  registrarAbono(cuentaId: string, request: RegistrarAbonoRequest): Observable<CuentaDTO> {
    return this.http.post<CuentaDTO>(`${this.apiUrl}/cuentas/${cuentaId}/abonos`, request);
  }

  aprobarAbono(abonoId: string): Observable<CuentaDTO> {
    return this.http.put<CuentaDTO>(`${this.apiUrl}/abonos/${abonoId}/aprobar`, {});
  }

  anularAbono(abonoId: string, motivo: string): Observable<CuentaDTO> {
    return this.http.put<CuentaDTO>(`${this.apiUrl}/abonos/${abonoId}/anular`, { motivo });
  }
}
