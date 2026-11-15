// core/models/pagoDTO.ts
// Contratos del módulo de pagos (ODO-39 / ODO-40). Los montos llegan como número con 2 decimales.

export type EstadoCuenta = 'ACTIVA' | 'SALDADA' | 'ANULADA';
export type EstadoAbono = 'PENDIENTE_DE_PAGO' | 'PAGADO';

export interface AbonoDTO {
  id: string;
  cuentaId: string;
  fecha: string;          // yyyy-MM-dd
  monto: number;
  citaId: string | null;
  observacion: string | null;
  estado: EstadoAbono;
  registradoPor: string | null;
  aprobadoPor: string | null;
  aprobadoEn: string | null;
  anulado: boolean;
  motivoAnulacion: string | null;
  anuladoPor: string | null;
  anuladoEn: string | null;
  creadoEn: string | null;
}

export interface CuentaDTO {
  id: string;
  pacienteId: string;
  tratamientoId: number | null;
  tratamientoNombre: string | null;
  descripcion: string;
  montoTotal: number;
  entrada: number;
  cuotaSugerida: number | null;
  totalPagado: number;
  totalPendiente: number;
  saldo: number;
  estado: EstadoCuenta;
  creadoPor: string | null;
  creadoEn: string | null;
  motivoAnulacion: string | null;
  abonos: AbonoDTO[];
}

export interface ResumenPagosDTO {
  pacienteId: string;
  totalCuentas: number;
  totalPagado: number;
  totalPendiente: number;
  saldo: number;
  cuentas: CuentaDTO[];
}

export interface CrearCuentaRequest {
  pacienteId: string;
  tratamientoId: number | null;
  descripcion: string;
  montoTotal: number;
  entrada: number | null;
  cuotaSugerida: number | null;
}

export interface RegistrarAbonoRequest {
  fecha: string | null;
  monto: number;
  citaId: string | null;
  observacion: string | null;
  estado: EstadoAbono;
}
