//src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PerfilPaciente } from './features/Doctor/ModuloPaciente/perfilPaciente/perfilPaciente';
import { Inicio } from './features/Home/inicioPagina/pages/inicioPag';
import { PagHome } from './features/Doctor/pagHome/pagHome';
import { ListaPaciente } from './features/Doctor/ModuloPaciente/listarPaciente/listarPaciente';
import { RegistroPaciente } from './features/Doctor/ModuloPaciente/registroPaciente/registroPaciente';
import { roleGuard } from './core/guards/roleGuard';
import { PagHomePaciente } from './features/Paciente/pagHomePaciente/pagHomePaciente';
import { AgendarCita } from './features/Paciente/agendarCita/agendarCita';
import { MisCitas } from './features/Paciente/misCitas/misCitas';
import { AjustesCuentaPaciente } from './features/Paciente/ajustesCuentaPaciente/ajustesCuentaPaciente';
import { HistorialClinicoPaciente } from './features/Paciente/moduloHistorialPaciente/historialClinicoPaciente/historialClinicoPaciente';
import { ConfiguracionHorario } from './features/Doctor/ModuloHorarios/configuracionHorario/configuracionHorario';
import { Tratamientos } from './features/Doctor/ModuloTratamientos/tratamientos/tratamientos';
import { AgendaDoctor } from './features/Doctor/ModuloCitas/agenda/agenda';
import { AgendarCitaDoctor } from './features/Doctor/ModuloCitas/agendarCitaDoctor/agendarCitaDoctor';
import { PanelHistoria } from './features/Doctor/ModuloHistoriasClinicas/panelHistoria/panelHistoria';
import { BuscarHistoria } from './features/Doctor/ModuloHistoriasClinicas/buscarHistoria/buscarHistoria';
import { AdminPlantillas } from './features/Doctor/ModuloDocumentos/adminPlantillas/adminPlantillas';


export const routes: Routes = [
  { path: '', component: Inicio },

  //Rutas Portal Doctor
  { path: 'doctor/home', 
    component: PagHome, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },

  //Modulo Pacientes
  { path: 'doctor/pacientes', 
    component: ListaPaciente, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR', 'ASISTENTE'] } },
  
  { path: 'doctor/pacientes/registro', 
    component: RegistroPaciente, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR', 'ASISTENTE'] } },
  
  { path: 'doctor/pacientes/:id/perfil', 
    component: PerfilPaciente, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },
  
  //Modulo Historias Clínicas
  { path: 'doctor/historias', 
    component: BuscarHistoria, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },

  { path: 'doctor/historias/:id',
    component: PanelHistoria, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },

  //Modulo Tratamientos
  { path: 'doctor/tratamientos', 
    component: Tratamientos, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },

  //Modulo Horarios
  { path: 'doctor/configuracion-horarios', 
    component: ConfiguracionHorario, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },

  //Modulo Citas
  { path: 'doctor/agenda', 
    component: AgendaDoctor, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },
  
  { path: 'doctor/agendar-cita/:idPaciente', 
    component: AgendarCitaDoctor, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },

  //Modulo Documentos
  { path: 'doctor/documentos', 
    component: AdminPlantillas, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },
    
  // Rutas Portal Paciente
  { path: 'paciente/home', 
    component: PagHomePaciente, 
    canActivate: [roleGuard], 
    data: { roles: ['PACIENTE'] } },
  
  { path: 'paciente/agendar-cita', 
    component: AgendarCita, 
    canActivate: [roleGuard], 
    data: { roles: ['PACIENTE'] } },

  { path: 'paciente/citas', 
    component: MisCitas, 
    canActivate: [roleGuard], 
    data: { roles: ['PACIENTE'] } },
  
  { path: 'paciente/cuenta-paciente', 
    component: AjustesCuentaPaciente, 
    canActivate: [roleGuard], 
    data: { roles: ['PACIENTE'] } },

  {
    path: 'paciente/historial',
    component: HistorialClinicoPaciente,
    canActivate: [roleGuard],
    data: { roles: ['PACIENTE'] }
  },

  // EL COMODÍN DE RUTAS NO ENCONTRADAS
  { 
    path: '**', 
    redirectTo: '' 
  }
];