// features/Doctor/ModuloPlantillas/adminPlantillas/adminPlantillas.ts
import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { PlantillaService } from '../../../../core/services/plantilla';
import { PlantillaDocumentoDTO } from '../../../../core/models/plantillaDTO';

@Component({
  selector: 'app-admin-plantillas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelDoctor],
  templateUrl: './adminPlantillas.html',
  styleUrl: './adminPlantillas.css'
})
export class AdminPlantillas implements OnInit {
  private plantillaService = inject(PlantillaService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  @ViewChild('textareaEditor') textareaEditor!: ElementRef<HTMLTextAreaElement>;

  plantillas: PlantillaDocumentoDTO[] = [];
  plantillaSeleccionada: PlantillaDocumentoDTO | null = null;
  
  cargandoLista: boolean = true;
  guardando: boolean = false;
  esNuevaPlantilla: boolean = false;

  // Catálogo de etiquetas mágicas soportadas por nuestro motor core
  etiquetasMagicas = [
    { tag: '[NOMBRE_PACIENTE]', desc: 'Nombre y apellido completo del paciente' },
    { tag: '[CEDULA_PACIENTE]', desc: 'Número de cédula de identidad del paciente' },
    { tag: '[NOMBRE_DOCTOR]', desc: 'Nombre del odontólogo que emite el documento' },
    { tag: '[FECHA_ACTUAL]', desc: 'La fecha del día en que se genera el reporte' }
  ];

  ngOnInit() {
    this.cargarPlantillas();
  }

  cargarPlantillas() {
    this.cargandoLista = true;
    this.plantillaService.listarPlantillas().subscribe({
      next: (data) => {
        this.plantillas = data;
        this.cargandoLista = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar plantillas:', err);
        this.cargandoLista = false;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarPlantilla(p: PlantillaDocumentoDTO) {
    this.esNuevaPlantilla = false;
    // Hacemos una copia profunda para no alterar la lista local si el doctor cancela los cambios
    this.plantillaSeleccionada = { ...p };
    this.cdr.detectChanges();
  }

  iniciarNuevaPlantilla() {
    this.esNuevaPlantilla = true;
    this.plantillaSeleccionada = {
      titulo: '',
      contenido: '',
      esActivo: true
    };
    this.cdr.detectChanges();
  }

  // Permite insertar la etiqueta mágica directamente donde esté parpadeando el cursor del texto
  inyectarEtiqueta(tag: string) {
    if (!this.plantillaSeleccionada) return;
    
    const textarea = this.textareaEditor.nativeElement;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textoActual = this.plantillaSeleccionada.contenido || '';

    // Insertamos el tag en la posición exacta del cursor
    this.plantillaSeleccionada.contenido = 
      textoActual.substring(0, startPos) + 
      tag + 
      textoActual.substring(endPos, textoActual.length);

    this.cdr.detectChanges();

    // Re-enfocamos el cursor justo después de la etiqueta insertada
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + tag.length, startPos + tag.length);
    }, 50);
  }

  guardarPlantilla() {
    if (!this.plantillaSeleccionada?.titulo.trim() || !this.plantillaSeleccionada.contenido.trim()) {
      alert('Por favor, complete el título y el cuerpo del documento antes de guardar.');
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.esNuevaPlantilla) {
      this.plantillaService.crearPlantilla(this.plantillaSeleccionada).subscribe({
        next: () => this.finalizarGuardado(),
        error: () => this.errorGuardado()
      });
    } else {
      this.plantillaService.actualizarPlantilla(this.plantillaSeleccionada.id!, this.plantillaSeleccionada).subscribe({
        next: () => this.finalizarGuardado(),
        error: () => this.errorGuardado()
      });
    }
  }

  eliminarPlantilla(id: string, event: Event) {
    event.stopPropagation(); // Evita que se dispare la selección de la tarjeta al hacer clic en borrar
    
    if (confirm('¿Está seguro de que desea eliminar esta plantilla de consentimiento?')) {
      this.plantillaService.eliminarPlantilla(id).subscribe({
        next: () => {
          this.plantillaSeleccionada = null;
          this.cargarPlantillas();
          alert('Plantilla removida del sistema.');
        },
        error: () => alert('Error al eliminar la plantilla.')
      });
    }
  }

  private finalizarGuardado() {
    this.guardando = false;
    this.plantillaSeleccionada = null;
    this.esNuevaPlantilla = false;
    alert('Plantilla guardada con éxito de manera global.');
    this.cargarPlantillas();
  }

  private errorGuardado() {
    this.guardando = false;
    alert('Error de conexión al procesar la plantilla.');
    this.cdr.detectChanges();
  }

  volverAlInicio() {
    this.router.navigate(['/doctor']);
  }
}