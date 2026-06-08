//src/app/features/Doctor/ModuloHistoriasClinicas/tab-odontograma/tab-odontograma.ts
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PacienteService } from '../../../../core/services/paciente';

@Component({
  selector: 'app-odontograma',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './tab-odontograma.html',
  styleUrl: './tab-odontograma.css'
})
export class Odontograma implements OnInit {
  @Input() idUsuario: string = '';
  
  private pacienteService = inject(PacienteService);
  private cdr = inject(ChangeDetectorRef);

  cargando: boolean = true;
  guardandoHallazgo: boolean = false; 
  mensajeExito: boolean = false;

  dientesSuperiores = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  dientesInferiores = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  posiciones = ['VESTIBULAR', 'OCLUSAL', 'PALATINO', 'DISTAL', 'MESIAL', 'GENERAL'];
  estados = ['SANO', 'CARIES', 'OBTURADO', 'AUSENTE', 'CORONA', 'ENDODONCIA', 'PERDIDA_PARCIAL', 'IMPLANTE', 'OTRO'];

  leyendaClinica = [
    { estado: 'SANO', color: '#ffffff', label: 'Sano' },
    { estado: 'CARIES', color: '#ef4444', label: 'Caries' },
    { estado: 'OBTURADO', color: '#3b82f6', label: 'Obturado / Calza' },
    { estado: 'AUSENTE', color: '#cbd5e1', label: 'Ausente (Extracción)' },
    { estado: 'CORONA', color: '#eab308', label: 'Corona' },
    { estado: 'ENDODONCIA', color: '#22c55e', label: 'Trat. Conducto' },
    { estado: 'PERDIDA_PARCIAL', color: '#f59e0b', label: 'Fractura' },
    { estado: 'IMPLANTE', color: '#a855f7', label: 'Implante' }
  ];

  nombresPiezas: { [key: number]: string } = {
    11: "Incisivo central superior derecho", 12: "Incisivo lateral superior derecho",
    13: "Canino superior derecho", 14: "Primer premolar superior derecho",
    15: "Segundo premolar superior derecho", 16: "Primer molar superior derecho",
    17: "Segundo molar superior derecho", 18: "Tercer molar superior derecho",
    21: "Incisivo central superior izquierdo", 22: "Incisivo lateral superior izquierdo",
    23: "Canino superior izquierdo", 24: "Primer premolar superior izquierdo",
    25: "Segundo premolar superior izquierdo", 26: "Primer molar superior izquierdo",
    27: "Segundo molar superior izquierdo", 28: "Tercer molar superior izquierdo",
    31: "Incisivo central inferior izquierdo", 32: "Incisivo lateral inferior izquierdo",
    33: "Canino inferior izquierdo", 34: "Primer premolar inferior izquierdo",
    35: "Segundo premolar inferior izquierdo", 36: "Primer molar inferior izquierdo",
    37: "Segundo molar inferior izquierdo", 38: "Tercer molar inferior izquierdo",
    41: "Incisivo central inferior derecho", 42: "Incisivo lateral inferior derecho",
    43: "Canino inferior derecho", 44: "Primer premolar inferior derecho",
    45: "Segundo premolar inferior derecho", 46: "Primer molar inferior derecho",
    47: "Segundo molar inferior derecho", 48: "Tercer molar inferior derecho"
  };

  mapaEstadosActuales = new Map<string, string>();
  
  // NUEVO: Variables para el historial
  historialCompleto: any[] = [];
  historialPiezaSeleccionada: any[] = [];
  
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
    
    // 1. Cargamos el mapa de estados ACTUALES (para pintar los colores)
    this.pacienteService.obtenerOdontogramaActual(this.idUsuario).subscribe({
      next: (dataActual: any[]) => {
        this.mapaEstadosActuales.clear();
        dataActual.forEach(item => {
          this.mapaEstadosActuales.set(`${item.idPieza}_${item.posicion}`, item.estado);
        });
        
        // 2. Cargamos el HISTORIAL completo (para la línea de tiempo)
        this.pacienteService.obtenerHistorialOdontograma(this.idUsuario).subscribe({
          next: (dataHistorial: any[]) => {
            this.historialCompleto = dataHistorial;
            setTimeout(() => {
              this.cargando = false;
              this.cdr.detectChanges();
            });
          },
          error: () => {
            this.cargando = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar odontograma', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarPieza(pieza: number, posicion: string = 'GENERAL') {
    this.piezaSeleccionada = pieza;
    this.posicionSeleccionada = posicion;
    this.mensajeExito = false; 
    
    const key = `${pieza}_${posicion}`;
    this.nuevoEstado = this.mapaEstadosActuales.get(key) || 'SANO';
    this.notasEstado = ''; 

    // Filtrar el historial solo para el diente clickeado y ordenarlo por fecha (más reciente primero)
    this.historialPiezaSeleccionada = this.historialCompleto
      .filter(h => h.idPieza === pieza)
      .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());

    this.cdr.detectChanges(); 
  }

  guardarEstadoDental() {
    if (!this.piezaSeleccionada || !this.idUsuario || this.guardandoHallazgo) return;

    this.guardandoHallazgo = true;
    this.cdr.detectChanges();

    const estadoFormateado = this.nuevoEstado.toUpperCase();
    const posicionFormateada = this.posicionSeleccionada.toUpperCase();

    const payload = {
      id: null,
      idPaciente: this.idUsuario,
      idPieza: this.piezaSeleccionada,
      posicion: posicionFormateada,
      estado: estadoFormateado, 
      notas: this.notasEstado,
      fechaRegistro: new Date().toISOString() // Enviamos la fecha actual para el optimismo gráfico
    };

    this.pacienteService.registrarEstadoOdontograma(this.idUsuario, payload).subscribe({
      next: () => {
        setTimeout(() => {
          // Actualización optimista de UI
          this.mapaEstadosActuales.set(`${this.piezaSeleccionada}_${posicionFormateada}`, estadoFormateado);
          this.historialPiezaSeleccionada.unshift(payload); // Añadimos el nuevo registro al inicio de la lista
          
          this.guardandoHallazgo = false;
          this.mensajeExito = true;
          this.cdr.detectChanges(); 
          
          this.cargarOdontograma(); // Sincroniza los UUIDs reales en segundo plano
          
          setTimeout(() => {
            this.piezaSeleccionada = null;
            this.mensajeExito = false;
            this.cdr.detectChanges();
          }, 1500);

        }, 50);
      },
      error: (err) => {
        console.error('Error al guardar estado dental:', err);
        alert('Error de conexión al guardar el diagnóstico.');
        this.guardandoHallazgo = false;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerClaseEstado(idPieza: number, posicion: string): string {
    const key = `${idPieza}_${posicion}`;
    const estado = this.mapaEstadosActuales.get(key);
    return estado ? estado.toUpperCase() : 'SANO';
  }

  obtenerNombrePieza(id: number | null): string {
    if (!id) return '';
    return this.nombresPiezas[id] || 'Pieza desconocida';
  }

  // Helper para pintar las etiquetas del historial del mismo color que el CSS
  obtenerColorPorEstado(estado: string): string {
    const estadoEncontrado = this.leyendaClinica.find(l => l.estado === estado);
    return estadoEncontrado && estadoEncontrado.estado !== 'SANO' ? estadoEncontrado.color : '#64748b';
  }
}