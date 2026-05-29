import { Routes } from '@angular/router';
import { PerfilPaciente } from './features/Doctor/ModuloPaciente/perfilPaciente/perfilPaciente';
import { Login } from './features/Auth/login/login';
import { Inicio } from './features/Home/inicioPagina/pages/inicioPag';
import { PagHome } from './features/Doctor/pagHome/pagHome';
import { ListaPaciente } from './features/Doctor/ModuloPaciente/listarPaciente/listarPaciente';
import { RegistroPaciente } from './features/Doctor/ModuloPaciente/registroPaciente/registroPaciente';
import { roleGuard } from './core/guards/roleGuard';
<<<<<<< HEAD
import { DetallePaciente } from './features/Doctor/ModuloPaciente/detallePaciente/detallePaciente';
=======
import { PagHomePaciente } from './features/Paciente/pagHomePaciente/pagHomePaciente';
import { AgendarCita } from './features/Paciente/agendarCita/agendarCita';
import { MisCitas } from './features/Paciente/misCitas/misCitas';
import { AjustesCuentaPaciente } from './features/Paciente/ajustesCuentaPaciente/ajustesCuentaPaciente';
import { HistorialClinicoPaciente } from './features/Paciente/historialClinicoPaciente/historialClinicoPaciente';
>>>>>>> origin/PanelPaciente

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },

  //Rutas Portal Doctor
  { path: 'doctor/home', 
    component: PagHome, 
    canActivate: [roleGuard], 
    data: { roles: ['DOCTOR'] } },
  
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
  
  { path: 'doctor/pacientes/:id/detalle', 
    component: DetallePaciente, 
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