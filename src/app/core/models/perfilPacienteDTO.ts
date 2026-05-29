
//core/models/perfilPacienteDTO.ts
export interface PacientePerfilDTO {
  id?: string; // Es opcional para la creación, obligatorio para la actualización
  grupoSanguineo: string;
  alergias: string;
  medicamentosHabituales: string;
  antecedentesFamiliares: string;
  motivoConsultaInicial: string;
}