// features/Doctor/ModuloHistoriasClinicas/tab-radiografias/tab-radiografias.ts
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RadiografiaService } from '../../../../core/services/radiografia';

@Component({
  selector: 'app-tab-radiografias',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './tab-radiografias.html',
  styleUrl: './tab-radiografias.css'
})
export class TabRadiografias implements OnInit {
  @Input() idUsuario: string = '';
  
  private radiografiaService = inject(RadiografiaService);
  private cdr = inject(ChangeDetectorRef);

  radiografias: any[] = [];
  cargandoLista: boolean = true;
  subiendoArchivo: boolean = false;

  imagenAmpliada: string | null = null;

  // Variables para el formulario de subida
  archivoSeleccionado: File | null = null;
  previewUrl: string | null = null;
  tipoRadiografia: string = 'PANORAMICA';
  tiposDisponibles = ['PANORAMICA', 'PERIAPICAL', 'CEFALOMETRICA', 'TOMOGRAFIA', 'FOTOGRAFIA_CLINICA'];

  ngOnInit() {
    if (this.idUsuario) {
      this.cargarRadiografias();
    }
  }

  cargarRadiografias() {
    this.cargandoLista = true;
    this.radiografiaService.obtenerPorPaciente(this.idUsuario).subscribe({
      next: (data) => {
        this.radiografias = data;
        this.cargandoLista = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar imágenes', err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Se ejecuta cuando el doctor selecciona un archivo de su PC
  alSeleccionarArchivo(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      
      // Creamos una URL temporal para mostrar la vista previa en el navegador
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  abrirImagen(url: string) {
    this.imagenAmpliada = url;
  }

  cerrarImagen() {
    this.imagenAmpliada = null;
  }

  descartarArchivo() {
    this.archivoSeleccionado = null;
    this.previewUrl = null;
    this.cdr.detectChanges();
  }

  subirImagen() {
    if (!this.archivoSeleccionado || !this.idUsuario) return;

    this.subiendoArchivo = true;
    this.cdr.detectChanges();

    this.radiografiaService.subirRadiografia(this.idUsuario, this.tipoRadiografia, this.archivoSeleccionado).subscribe({
      next: (nuevaImagen) => {
        this.subiendoArchivo = false;
        this.descartarArchivo();
        this.radiografias.unshift(nuevaImagen); // Añadimos la nueva foto al inicio de la galería
        alert('Imagen guardada en el expediente con éxito.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.subiendoArchivo = false;
        alert('Error al subir el archivo al servidor.');
        this.cdr.detectChanges();
      }
    });
  }
}