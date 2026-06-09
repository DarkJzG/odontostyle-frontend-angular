import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PlantillaService } from '../../../../core/services/plantilla';
import { PlantillaDocumentoDTO } from '../../../../core/models/plantillaDTO';

@Component({
  selector: 'app-sec-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './sec-documentos.html',
  styleUrl: './sec-documentos.css'
})
export class SecDocumentos implements OnInit {
  @Input() idUsuario: string = '';
  @Input() paciente: any = null;

  private plantillaService = inject(PlantillaService);
  private cdr = inject(ChangeDetectorRef);

  listaPlantillas: PlantillaDocumentoDTO[] = [];
  plantillaSeleccionada: PlantillaDocumentoDTO | null = null;
  
  tituloProcesado: string = '';
  cuerpoProcesado: string = '';
  
  cargandoLista: boolean = true;

  ngOnInit() {
    if (this.idUsuario) {
      this.cargarPlantillasDisponibles();
    }
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
      alert("Espera un momento, estamos cargando tu información...");
      return;
    }

    this.plantillaSeleccionada = plantilla;
    this.tituloProcesado = plantilla.titulo;

    let textoLimpio = plantilla.contenido || '';

    const nombres = this.paciente.nombres || '';
    const apellidos = this.paciente.apellidos || '';
    const nombreCompleto = `${nombres} ${apellidos}`.trim();
    
    // Remplazamos las etiquetas genéricas con los datos reales del paciente logueado
    textoLimpio = textoLimpio.replace(/\[NOMBRE_PACIENTE\]/g, nombreCompleto || '__________________');
    textoLimpio = textoLimpio.replace(/\[CEDULA_PACIENTE\]/g, this.paciente.cedula || '__________________');
    
    // Para la vista del paciente, dejamos el campo del doctor abierto para ser llenado o lo asociamos al staff general
    textoLimpio = textoLimpio.replace(/\[NOMBRE_DOCTOR\]/g, 'Odontólogo Tratante');

    const fechaLarga = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
    textoLimpio = textoLimpio.replace(/\[FECHA_ACTUAL\]/g, fechaLarga);

    this.cuerpoProcesado = textoLimpio;
    this.cdr.detectChanges();
  }

  imprimirDocumento() {
    window.print();
  }
}