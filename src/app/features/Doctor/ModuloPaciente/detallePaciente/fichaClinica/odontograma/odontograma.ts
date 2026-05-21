import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PacienteService } from '../../../../../../core/services/paciente';

@Component({
  selector: 'app-odontograma',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './odontograma.html',
  styleUrl: './odontograma.css'
})
export class Odontograma implements OnInit {
  @Input() idUsuario: string = '';
  
  private pacienteService = inject(PacienteService);
  private cdr = inject(ChangeDetectorRef);

  cargando: boolean = true;

  dientesSuperiores = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  dientesInferiores = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  posiciones = ['VESTIBULAR', 'OCLUSAL', 'PALATINO', 'DISTAL', 'MESIAL', 'GENERAL'];
  estados = ['SANO', 'CARIES', 'OBTURADO', 'AUSENTE', 'CORONA', 'ENDODONCIA', 'IMPLANTE', 'OTRO'];

  // NUEVO: Diccionario para mostrar el nombre amigable de la pieza
  nombresPiezas: { [key: number]: string } = {
    11: "Incisivo central superior derecho",
    12: "Incisivo lateral superior derecho",
    13: "Canino superior derecho",
    14: "Primer premolar superior derecho",
    15: "Segundo premolar superior derecho",
    16: "Primer molar superior derecho",
    17: "Segundo molar superior derecho",
    18: "Tercer molar superior derecho",
    21: "Incisivo central superior izquierdo",
    22: "Incisivo lateral superior izquierdo",
    23: "Canino superior izquierdo",
    24: "Primer premolar superior izquierdo",
    25: "Segundo premolar superior izquierdo",
    26: "Primer molar superior izquierdo",
    27: "Segundo molar superior izquierdo",
    28: "Tercer molar superior izquierdo",
    31: "Incisivo central inferior izquierdo",
    32: "Incisivo lateral inferior izquierdo",
    33: "Canino inferior izquierdo",
    34: "Primer premolar inferior izquierdo",
    35: "Segundo premolar inferior izquierdo",
    36: "Primer molar inferior izquierdo",
    37: "Segundo molar inferior izquierdo",
    38: "Tercer molar inferior izquierdo",
    41: "Incisivo central inferior derecho",
    42: "Incisivo lateral inferior derecho",
    43: "Canino inferior derecho",
    44: "Primer premolar inferior derecho",
    45: "Segundo premolar inferior derecho",
    46: "Primer molar inferior derecho",
    47: "Segundo molar inferior derecho",
    48: "Tercer molar inferior derecho"
  };

  // Estado cargado desde el backend
  mapaEstadosActuales = new Map<string, string>();
  
  // Control del panel lateral/modal para agregar un estado
  piezaSeleccionada: number | null = null;
  posicionSeleccionada: string = 'GENERAL';
  nuevoEstado: string = 'SANO';
  notasEstado: string = '';

  ngOnInit() {
    if (this.idUsuario) {
      this.cargarOdontograma();
    }
  }

  cargarOdontograma() {
      this.cargando = true;
      this.pacienteService.obtenerOdontogramaActual(this.idUsuario).subscribe({
        next: (data: any[]) => {
          this.mapaEstadosActuales.clear();
          data.forEach(item => {
            // Crear llave única para búsqueda rápida
            this.mapaEstadosActuales.set(`${item.piezaId}_${item.posicion}`, item.estado);
          });
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar odontograma', err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }

  // Abre el panel para editar una pieza
  seleccionarPieza(pieza: number, posicion: string = 'GENERAL') {
    this.piezaSeleccionada = pieza;
    this.posicionSeleccionada = posicion;
    
    // Predeterminar el estado actual si existe
    const key = `${pieza}_${posicion}`;
    this.nuevoEstado = this.mapaEstadosActuales.get(key) || 'SANO';
    this.notasEstado = ''; 
  }

  guardarEstadoDental() {
    if (!this.piezaSeleccionada || !this.idUsuario) return;

    const payload = {
      piezaId: this.piezaSeleccionada,
      posicion: this.posicionSeleccionada,
      estado: this.nuevoEstado,
      notas: this.notasEstado
    };

    this.pacienteService.registrarEstadoOdontograma(this.idUsuario, payload).subscribe({
      next: () => {
        this.cargarOdontograma(); // Recargar para ver los colores actualizados
        this.piezaSeleccionada = null; // Cerrar panel
      },
      error: (err) => {
        console.error('Error al guardar estado', err);
        alert('Error al guardar el diagnóstico dental.');
      }
    });
  }

  // Método auxiliar para pintar los colores en el HTML
  obtenerClaseEstado(piezaId: number, posicion: string): string {
    const key = `${piezaId}_${posicion}`;
    return this.mapaEstadosActuales.get(key) || 'SANO'; // Retorna SANO (blanco) por defecto
  }

  obtenerNombrePieza(id: number | null): string {
    if (!id) return '';
    return this.nombresPiezas[id] || 'Pieza desconocida';
  }
}