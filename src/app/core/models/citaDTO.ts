// core/models/citaDTO.ts

// Lo que enviamos al backend para crear la cita
export interface CitaRequestDTO {
  idPaciente: string;
  idTratamiento: number;
  idDoctor: string;
  fechaHoraInicio: string; // Formato: 'yyyy-MM-ddTHH:mm:ss'
}

// Lo que el backend nos devuelve
export interface CitaResponseDTO {
  id: string;
  idPaciente: string;
  nombrePaciente: string;
  idTratamiento?: number;
  nombreTratamiento: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: string; // PENDIENTE, COMPLETADA, CANCELADA, FALTA
}