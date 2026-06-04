// features/Doctor/ModuloHistoriasClinicas/tab-documentos/tab-documentos.ts
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PlantillaService } from '../../../../core/services/plantilla';
import { AuthService } from '../../../../core/services/auth';
import { PlantillaDocumentoDTO } from '../../../../core/models/plantillaDTO';
import { UsuarioService } from '../../../../core/services/usuario';

@Component({
  selector: 'app-tab-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './tab-documentos.html',
  styleUrl: './tab-documentos.css'
})
export class TabDocumentos implements OnInit {
  @Input() idUsuario: string = '';
  @Input() paciente: any = null; // Recibimos el objeto completo del paciente desde el padre

  private plantillaService = inject(PlantillaService);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  listaPlantillas: PlantillaDocumentoDTO[] = [];
  plantillaSeleccionada: PlantillaDocumentoDTO | null = null;
  
  // Variables para el texto ya procesado
  tituloProcesado: string = '';
  cuerpoProcesado: string = '';
  nombreDoctor: string = '';
  
  cargandoLista: boolean = true;

  ngOnInit() {
    if (this.idUsuario) {
      this.nombreDoctor = this.authService.obtenerNombreUsuario();
      this.cargarPlantillasDisponibles();
      if (!this.paciente || !this.paciente.nombres) {
        this.recuperarDatosPaciente();
      }
    }
  }

  recuperarDatosPaciente() {
    this.usuarioService.obtenerPorId(this.idUsuario).subscribe({
      next: (data) => {
        this.paciente = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error recuperando paciente en documentos', err)
    });
  }

  cargarPlantillasDisponibles() {
    this.cargandoLista = true;
    this.plantillaService.listarPlantillas().subscribe({
      next: (data) => {
        this.listaPlantillas = data;
        this.cargandoLista = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar catálogo de documentos:', err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarYProcesarDocumento(plantilla: PlantillaDocumentoDTO) {
    if (!this.paciente) {
      alert("Cargando datos del paciente, por favor espere un segundo...");
      return;
    }

    this.plantillaSeleccionada = plantilla;
    this.tituloProcesado = plantilla.titulo;

    let textoLimpio = plantilla.contenido || '';

    // DEBUG: Descomenta la siguiente línea para ver en consola qué tiene el objeto paciente
    // console.log("Datos del paciente:", this.paciente);

    // IMPORTANTE: Verifica que los nombres nombres/apellidos coincidan con tu UsuarioDTO
    const nombres = this.paciente.nombres || '';
    const apellidos = this.paciente.apellidos || '';
    const nombreCompleto = `${nombres} ${apellidos}`.trim();
    
    textoLimpio = textoLimpio.replace(/\[NOMBRE_PACIENTE\]/g, nombreCompleto || 'PACIENTE NO IDENTIFICADO');
    textoLimpio = textoLimpio.replace(/\[CEDULA_PACIENTE\]/g, this.paciente.cedula || '___________');
    
    const doctorFormateado = this.nombreDoctor ? `Dr. ${this.nombreDoctor}` : 'Odontólogo Especialista';
    textoLimpio = textoLimpio.replace(/\[NOMBRE_DOCTOR\]/g, doctorFormateado);

    const fechaLarga = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
    textoLimpio = textoLimpio.replace(/\[FECHA_ACTUAL\]/g, fechaLarga);

    this.cuerpoProcesado = textoLimpio;
    this.cdr.detectChanges();
  }

  imprimirDocumento() {
    window.print();
  }
}