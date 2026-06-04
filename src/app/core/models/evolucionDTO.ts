
// src/app/core/models/evolucionDTO.ts
export interface EvolucionDTO {
  id?: string;
  idCita: string;
  descripcionProcedimiento: string;
  prescripcionMedica?: string;
  observaciones?: string;
  proximaCitaSugerida?: string | null;
  creadoEn?: string;
  actualizadoEn?: string;
}