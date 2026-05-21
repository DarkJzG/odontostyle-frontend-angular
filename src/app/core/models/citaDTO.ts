export interface CitaRequestDTO {
  pacienteId: string;       // Recibe el UUID del paciente logueado
  tratamientoId: number;    // Long de Java -> number
  disponibilidadId: number; // Long de Java -> number
  fechaHoraInicio: string;  // LocalDateTime viaja en formato ISO (ej: '2026-05-20T10:00:00')
}

export interface CitaResponseDTO {
  idCita: string;
  nombrePaciente: string;
  nombreTratamiento: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: string;           // PENDIENTE, COMPLETADA, CANCELADA
}