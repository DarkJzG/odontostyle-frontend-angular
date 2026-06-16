import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarPanelPaciente } from '../../../core/layout/navbarPanelPaciente/navbarPanelPaciente';
import { UsuarioService } from '../../../core/services/usuario';
import { UsuarioDTO } from '../../../core/models/usuarioDTO';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-ajustes-cuenta-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, NavbarPanelPaciente],
  templateUrl: './ajustesCuentaPaciente.html',
  styleUrl: './ajustesCuentaPaciente.css'
})
export class AjustesCuentaPaciente implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);
  private keycloak = inject(KeycloakService);

  perfilForm!: FormGroup;
  cargando: boolean = false;
  esEditable: boolean = false;
  huboError: boolean = false;
  
  private emailPaciente: string = ''; // Ahora usamos el email
  private idInternoBD: string = '';
  private datosOriginales: any = null;
  paciente: any = null;

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombres: [{ value: '', disabled: true }, Validators.required],
      apellidos: [{ value: '', disabled: true }, Validators.required],
      cedula: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });

    // Extraemos el email del token de Keycloak
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
    this.emailPaciente = tokenParsed?.['email'] || tokenParsed?.['preferred_username'] || '';

    if (this.emailPaciente) {
      this.cargarDatosPerfil();
    } else {
      console.error('No se pudo obtener el email del token');
      this.huboError = true;
    }
  }

  cargarDatosPerfil() {
    this.cargando = true;
    this.huboError = false;

    // Fíjate bien en la ruta: 'buscar-correo' (como está en tu controller)
    this.usuarioService.obtenerPorEmail(this.emailPaciente).subscribe({
      next: (data: any) => {
        this.paciente = data;
        this.datosOriginales = data;
        this.idInternoBD = data.id || '';

        this.perfilForm.patchValue({
          nombres: data.nombres,
          apellidos: data.apellidos,
          cedula: data.cedula,
          telefono: data.telefono,
          email: data.email
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al obtener perfil:', err);
        this.cargando = false;
        this.huboError = true;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEdicion() {
    this.esEditable = !this.esEditable;
    const campos = ['nombres', 'apellidos', 'telefono', 'email'];
    if (this.esEditable) {
      campos.forEach(c => this.perfilForm.get(c)?.enable());
    } else {
      this.perfilForm.patchValue(this.datosOriginales);
      campos.forEach(c => this.perfilForm.get(c)?.disable());
    }
  }

  guardarCambios() {
    if (this.perfilForm.invalid) return;
    
    // 1. Activamos carga
    this.cargando = true;
    this.cdr.detectChanges(); // Forzamos mostrar el spinner
    
    // Obtenemos datos editados y combinamos con los originales (incluyendo el rol)
    const datosEditados = this.perfilForm.getRawValue();
    const payload = {
      ...this.datosOriginales, 
      ...datosEditados         
    };

    // 2. Ejecutamos la petición
    this.usuarioService.actualizarUsuario(this.idInternoBD, payload).subscribe({
      next: (data: any) => {
        // Al tener éxito, actualizamos los datos locales
        this.datosOriginales = data;
        this.paciente = data;
        
        // 3. ¡IMPORTANTE! Desactivamos el spinner AQUÍ
        this.cargando = false;
        this.toggleEdicion(); // Bloqueamos los inputs tras guardar
        alert('Información actualizada correctamente');
        this.cdr.detectChanges(); // Forzamos refresco de vista
      },
      error: (err: any) => {
        console.error('Error al actualizar:', err);
        
        // 3. ¡IMPORTANTE! Desactivamos el spinner AQUÍ también si falla
        this.cargando = false;
        alert('Error al guardar cambios: ' + (err.error?.mensaje || 'Intenta de nuevo'));
        this.cdr.detectChanges(); // Forzamos refresco para quitar el spinner
      }
    });
  }

  volver() { this.router.navigate(['/paciente/home']); }
}