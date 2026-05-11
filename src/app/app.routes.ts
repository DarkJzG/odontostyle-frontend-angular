import { Routes } from '@angular/router';
import { PerfilPaciente } from './features/Doctor/ModuloPacientes/perfilPaciente/perfilPaciente';
import { Login } from './features/Auth/login/login';
import { Inicio } from './features/Home/inicioPagina/pages/inicioPag';
import { PagHome } from './features/Doctor/pagHome/pagHome';
import { ListaPaciente } from './features/Doctor/ModuloPacientes/listarPaciente/listarPaciente';
import { RegistroPaciente } from './features/Doctor/ModuloPacientes/registroPaciente/registroPaciente';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },

  //Rutas Portal Doctor
  { path: 'doctor/home', component: PagHome },
  { path: 'doctor/pacientes', component: ListaPaciente },
  { path: 'doctor/pacientes/registro', component: RegistroPaciente },
  { path: 'doctor/pacientes/:id/perfil', component: PerfilPaciente },

  { path: '**', redirectTo: '' }
];
