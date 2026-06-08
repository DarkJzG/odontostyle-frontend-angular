//src/app/core/models/horarioDoctorDTO.ts

export interface HorarioDoctorDTO {
  id?: number;
  idDoctor: string;
  diaSemana: string;
  horaInicio: string; // Formato 'HH:mm'
  horaFin: string;    // Formato 'HH:mm'
}