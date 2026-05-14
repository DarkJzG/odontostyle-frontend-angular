import { Routes } from '@angular/router';
import { PerfilPaciente } from './features/Doctor/ModuloPaciente/perfilPaciente/perfilPaciente';
import { Login } from './features/Auth/login/login';
import { Inicio } from './features/Home/inicioPagina/pages/inicioPag';
import { PagHome } from './features/Doctor/pagHome/pagHome';
import { ListaPaciente } from './features/Doctor/ModuloPaciente/listarPaciente/listarPaciente';
import { RegistroPaciente } from './features/Doctor/ModuloPaciente/registroPaciente/registroPaciente';
import { roleGuard } from './core/guards/roleGuard';

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

  { path: '**', redirectTo: '' }
];
