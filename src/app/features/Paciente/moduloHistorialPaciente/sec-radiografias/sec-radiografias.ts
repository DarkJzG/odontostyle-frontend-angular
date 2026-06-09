import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RadiografiaService } from '../../../../core/services/radiografia';

@Component({
  selector: 'app-sec-radiografias',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sec-radiografias.html',
  styleUrl: './sec-radiografias.css'
})
export class SecRadiografias implements OnInit {
  @Input() idUsuario: string = '';
  
  private radiografiaService = inject(RadiografiaService);
  private cdr = inject(ChangeDetectorRef);

  radiografias: any[] = [];
  cargandoLista: boolean = true;
  imagenAmpliada: string | null = null;

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
        console.error('Error al cargar imágenes:', err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirImagen(url: string) {
    this.imagenAmpliada = url;
  }

  cerrarImagen() {
    this.imagenAmpliada = null;
  }
}