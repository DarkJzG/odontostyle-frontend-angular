import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { KeycloakService } from 'keycloak-angular';

import { NavbarPanelPaciente } from '../../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';
import { UsuarioService } from '../../../../core/services/usuario';
import { SecHistorial } from '../sec-historial/sec-historial';
import { SecEvoluciones } from '../sec-evoluciones/sec-evoluciones';
import { SecRecetas } from '../sec-recetas/sec-recetas';
import { SecRadiografias } from '../sec-radiografias/sec-radiografias';
import { SecDocumentos } from '../sec-documentos/sec-documentos';

@Component({
  selector: 'app-historial-clinico-paciente',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    NavbarPanelPaciente, 
    SecHistorial,
    SecEvoluciones,
    SecRecetas,
    SecRadiografias,
    SecDocumentos
  ],
  templateUrl: './historialClinicoPaciente.html',
  styleUrl: './historialClinicoPaciente.css'
})
export class HistorialClinicoPaciente implements OnInit {
  private usuarioService = inject(UsuarioService);
  private keycloak = inject(KeycloakService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  idUsuario: string = '';
  paciente: any = null;
  cargando: boolean = true;
  pestanaActiva: string = 'historial';

  ngOnInit(): void {
    this.cargarPaciente();
  }

  cargarPaciente() {
    this.cargando = true;
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
    const emailPaciente = tokenParsed?.['email'] || tokenParsed?.['preferred_username'] || '';

    if (emailPaciente) {
      this.usuarioService.obtenerPorEmail(emailPaciente).subscribe({
        next: (data: any) => {
          this.paciente = data;
          this.idUsuario = data.id || '';
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar datos del paciente:', err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.cargando = false;
    }
  }

  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
  }

  volver() {
    this.router.navigate(['/paciente/home']);
  }
}