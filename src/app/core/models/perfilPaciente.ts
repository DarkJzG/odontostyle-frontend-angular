export interface PacientePerfilDTO {
  idPaciente?: string; // Es opcional (?) porque al crear uno nuevo, el ID va en la URL
  grupoSanguineo: string;
  alergias: string;
  medicamentosHabituales: string;
  antecedentesFamiliares: string;
  motivoConsultaInicial: string;
}