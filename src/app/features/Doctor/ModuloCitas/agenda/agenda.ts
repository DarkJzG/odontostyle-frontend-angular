// src/app/features/Doctor/ModuloCitas/agenda/agenda.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // <-- IMPORTANTE
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { CitaService } from '../../../../core/services/cita';
import { HorarioDoctorService } from '../../../../core/services/horarioDoctor';
import { AuthService } from '../../../../core/services/auth';
import { EvolucionService } from '../../../../core/services/evolucion';
import {EvolucionDTO} from '../../../../core/models/evolucionDTO';

interface CeldaAgenda {
  diaDate: Date;
  fechaStr: string;
  horaStr: string;
  cita: any | null;
  disponible: boolean;
}

@Component({
  selector: 'app-agenda-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelDoctor],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class AgendaDoctor implements OnInit {
  private citaService = inject(CitaService);
  private horarioService = inject(HorarioDoctorService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private evolucionService = inject(EvolucionService);

  cargando: boolean = true; 
  citasTotales: any[] = [];
  horariosBase: any[] = [];
  proximaCita: any = null;

  // Variables del Calendario Semanal
  semanaActualLunes: Date = new Date();
  diasDeLaSemana: Date[] = [];
  bloquesHorarios: string[] = []; 
  matrizCalendario: CeldaAgenda[][] = []; // [Fila Hora][Columna Día]
  tituloSemanaVisual: string = '';

  dialogo = { visible: false, mensaje: '', tipo: '', accionConfirmar: () => {} };

  modalEvolucionVisible: boolean = false;
  guardandoEvolucion: boolean = false;
  citaAAtender: any = null;
  agendarProximaAutomaticamente: boolean = false;
  
  formularioEvolucion: EvolucionDTO = {
    idCita: '',
    descripcionProcedimiento: '',
    prescripcionMedica: '',
    observaciones: '',
    proximaCitaSugerida: null
  };

  ngOnInit(): void {
    // Calculamos el lunes de la semana actual al iniciar
    this.calcularLunesActual();
    this.cargarDatosAgenda();
  }

  calcularLunesActual() {
    const hoy = new Date();
    const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay(); // 1=Lun, 7=Dom
    this.semanaActualLunes = new Date(hoy);
    this.semanaActualLunes.setDate(hoy.getDate() - (diaSemana - 1));
    this.semanaActualLunes.setHours(0, 0, 0, 0);
  }

  cambiarSemana(incremento: number) {
    this.semanaActualLunes.setDate(this.semanaActualLunes.getDate() + (incremento * 7));
    this.construirCuadricula(); // Solo reconstruimos la vista, no llamamos al backend a menos que sea necesario
  }

  cargarDatosAgenda() {
    const idDoctor = this.authService.obtenerIdUsuarioLogueado();
    if (!idDoctor) return;

    this.cargando = true;
    this.cdr.detectChanges();

    // Hacemos ambas peticiones en paralelo
    forkJoin({
      citas: this.citaService.obtenerCitasPorDoctor(idDoctor),
      horarios: this.horarioService.obtenerHorariosPorDoctor(idDoctor)
    }).subscribe({
      next: (respuesta) => {
        this.horariosBase = respuesta.horarios || [];
        
        // Mapeamos las citas para uso interno
        this.citasTotales = (respuesta.citas || []).map((cita: any) => {
          const [fecha, horaCompleta] = cita.fechaHoraInicio.split('T');
          const horaLimpia = horaCompleta.substring(0, 5); // "14:30"
          const tratamientoLimpio = (cita.nombreTratamiento || '').split(' con ')[0];
          const idPaciente = cita.idPaciente || cita.pacienteId;

          return {
            id: cita.id, 
            idPaciente: idPaciente,
            idRecortado: cita.id ? cita.id.toString().substring(0, 8).toUpperCase() : '',
            paciente: cita.nombrePaciente,
            tratamiento: tratamientoLimpio,
            fecha: fecha, 
            hora24: horaLimpia,
            horaAMPM: this.formatearHoraAMPM(horaCompleta),
            fechaHoraReal: new Date(cita.fechaHoraInicio),
            estadoVisual: this.normalizarEstado(cita.estado)
          };
        });

        this.identificarProximaCita();
        this.construirCuadricula();
        
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error cargando agenda:", err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  identificarProximaCita() {
    const ahora = new Date();
    const pendientes = this.citasTotales.filter(c => c.estadoVisual === 'Pendiente' && c.fechaHoraReal >= ahora);
    pendientes.sort((a, b) => a.fechaHoraReal.getTime() - b.fechaHoraReal.getTime());
    this.proximaCita = pendientes.length > 0 ? pendientes[0] : null;
  }

  // ================= MOTOR DEL CALENDARIO (FILAS Y COLUMNAS) =================

  construirCuadricula() {
    // 1. Array de los 7 días de la semana
    this.diasDeLaSemana = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(this.semanaActualLunes);
      dia.setDate(this.semanaActualLunes.getDate() + i);
      this.diasDeLaSemana.push(dia);
    }

    // Título Visual: "Semana del 11 Nov al 17 Nov"
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const strInicio = this.diasDeLaSemana[0].toLocaleDateString('es-ES', opciones);
    const strFin = this.diasDeLaSemana[6].toLocaleDateString('es-ES', opciones);
    this.tituloSemanaVisual = `Semana del ${strInicio} al ${strFin}`;

    // 2. Definir rango de horas (Desde la más temprana hasta la más tardía del doctor)
    let horaInicioDia = 8.0; // 08:00 por defecto
    let horaFinDia = 18.0;   // 18:00 por defecto

    if (this.horariosBase.length > 0) {
      const inicios = this.horariosBase.map(h => this.horaToDecimal(h.horaInicio));
      const fines = this.horariosBase.map(h => this.horaToDecimal(h.horaFin));
      horaInicioDia = Math.floor(Math.min(...inicios));
      horaFinDia = Math.ceil(Math.max(...fines));
    }

    // Crear bloques cada 30 minutos (0.5)
    this.bloquesHorarios = [];
    for (let h = horaInicioDia; h < horaFinDia; h += 0.25) {
      this.bloquesHorarios.push(this.decimalToHora(h));
    }

    // 3. Cruzar datos en la Matriz [Fila Hora][Columna Día]
    this.matrizCalendario = [];
    
    for (let f = 0; f < this.bloquesHorarios.length; f++) {
      const horaFilaStr = this.bloquesHorarios[f];
      const fila: CeldaAgenda[] = [];

      for (let c = 0; c < this.diasDeLaSemana.length; c++) {
        const diaColumna = this.diasDeLaSemana[c];
        const fechaStr = this.obtenerFechaISO(diaColumna); // "YYYY-MM-DD"
        
        // El backend maneja días como: MONDAY(1), TUESDAY(2)...
        const mapeoDias = [7, 1, 2, 3, 4, 5, 6]; // Ajuste donde getDay() 0 es Domingo(7)
        const diaNumero = mapeoDias[diaColumna.getDay()]; 

        // Verificamos si el doctor trabaja en este día y bloque horario
        const horarioLaboral = this.horariosBase.find(h => 
          this.traducirDiaEnumANumero(h.diaSemana) === diaNumero &&
          this.estaEnRangoHorario(horaFilaStr, h.horaInicio, h.horaFin)
        );

        // Verificamos si hay una cita que coincida exactamente
        const citaAsignada = this.citasTotales.find(cita => cita.fecha === fechaStr && cita.hora24 === horaFilaStr);

        fila.push({
          diaDate: diaColumna,
          fechaStr: fechaStr,
          horaStr: horaFilaStr,
          cita: citaAsignada || null,
          disponible: !!horarioLaboral && !citaAsignada // True si trabaja y no hay cita
        });
      }
      this.matrizCalendario.push(fila);
    }
  }

  // ================= ACCIONES Y HELPERS =================

  actualizarEstado(id: string, nuevoEstado: string) {
    if (nuevoEstado === 'CANCELADA') {
      this.dialogo = {
        visible: true,
        mensaje: `¿Está seguro de que desea cancelar esta cita y liberar el espacio en la agenda?`,
        tipo: 'peligro',
        accionConfirmar: () => this.ejecutarCancelacion(id)
      };
    } else if (nuevoEstado === 'COMPLETADA') {
      // Buscamos los datos de la cita seleccionada para mostrarlos en el encabezado del formulario médico
      this.citaAAtender = this.citasTotales.find(c => c.id === id);
      
      this.formularioEvolucion = {
        idCita: id,
        descripcionProcedimiento: '',
        prescripcionMedica: '',
        observaciones: '',
        proximaCitaSugerida: null
      };
      this.agendarProximaAutomaticamente = false;
      this.modalEvolucionVisible = true;
      this.cdr.detectChanges();
    }
  }

  ejecutarCancelacion(id: string) {
    this.citaService.cambiarEstadoCita(id, 'CANCELADA').subscribe({
      next: () => {
        this.cerrarDialogo();
        this.cargarDatosAgenda();
      },
      error: () => {
        alert('Ocurrió un error al procesar la cancelación.');
        this.cerrarDialogo();
      }
    });
  }

  ejecutarActualizacion(id: string, nuevoEstado: string) {
    this.citaService.cambiarEstadoCita(id, nuevoEstado).subscribe({
      next: () => {
        this.cerrarDialogo();
        this.cargarDatosAgenda(); 
      },
      error: () => {
        alert('Error al actualizar la cita.');
        this.cerrarDialogo();
      }
    });
  }

  guardarEvolucionMedica() {
    if (!this.formularioEvolucion.descripcionProcedimiento || this.formularioEvolucion.descripcionProcedimiento.trim().length < 10) {
      alert('Por favor, redacte una descripción detallada del procedimiento realizado (mínimo 10 caracteres).');
      return;
    }

    this.guardandoEvolucion = true;
    this.cdr.detectChanges();

    if (!this.formularioEvolucion.proximaCitaSugerida) {
      this.formularioEvolucion.proximaCitaSugerida = null;
    } else {
      this.formularioEvolucion.proximaCitaSugerida = `${this.formularioEvolucion.proximaCitaSugerida}T00:00:00`;
    }

    this.evolucionService.registrarEvolucion(this.formularioEvolucion).subscribe({
      next: () => {
        this.guardandoEvolucion = false;
        this.modalEvolucionVisible = false;
        if (this.agendarProximaAutomaticamente && this.citaAAtender) {
           const idPaciente = this.citaAAtender.idPaciente || this.citaAAtender.pacienteId; 
           this.router.navigate(['/doctor/agendar-cita', this.citaAAtender.idPaciente]);
        } else {
           alert('Evolución clínica registrada e historial actualizado correctamente.');
           this.cargarDatosAgenda(); 
        }
        this.citaAAtender = null;
      },
      error: (err) => {
        this.guardandoEvolucion = false;
        console.error(err);
        alert('Error al guardar la evolución médica en el servidor.');
      }
    });
  }

  cerrarModalEvolucion() {
    if (this.guardandoEvolucion) return;
    this.modalEvolucionVisible = false;
    this.citaAAtender = null;
  }
  // Traductores Matemáticos de Horas
  private horaToDecimal(hora: string): number {
    const [hh, mm] = hora.split(':').map(Number);
    return hh + (mm / 60);
  }
  private decimalToHora(dec: number): string {
    const horas = Math.floor(dec);
    const minutos = Math.round((dec - horas) * 60);
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }
  private estaEnRangoHorario(hora: string, inicio: string, fin: string): boolean {
    const h = this.horaToDecimal(hora);
    const i = this.horaToDecimal(inicio);
    const f = this.horaToDecimal(fin);
    return h >= i && h < f;
  }
  private traducirDiaEnumANumero(diaEnum: string): number {
    const mapa: { [key: string]: number } = { 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 7 };
    return mapa[diaEnum.toUpperCase()] || 1;
  }
  private obtenerFechaISO(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Formateadores de Texto en ESPAÑOL
  obtenerNombreDia(date: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[date.getDay()];
  }
  obtenerFechaCortaEsp(date: Date): string {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate().toString().padStart(2, '0')} ${meses[date.getMonth()]}`;
  }
  formatearFechaLargaEsp(fechaStr: string): string {
    if (!fechaStr) return '';
    const [y, m, d] = fechaStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${dias[date.getDay()]}, ${d.toString().padStart(2, '0')} de ${meses[m - 1]} de ${y}`;
  }
  private formatearHoraAMPM(horaStr: string): string {
    if (!horaStr) return '';
    const partes = horaStr.split(':');
    let horas = parseInt(partes[0], 10);
    const minutos = partes[1];
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12; 
    return `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;
  }
  private normalizarEstado(estadoBackend: string): string {
    if (!estadoBackend) return 'Pendiente';
    const est = estadoBackend.toUpperCase();
    if (est === 'PENDIENTE') return 'Pendiente';
    if (est === 'COMPLETADA' || est === 'ATENDIDA') return 'Completada';
    if (est === 'CANCELADA') return 'Cancelada';
    return estadoBackend;
  }

  cerrarDialogo() { this.dialogo.visible = false; }
  irA(ruta: string) { this.router.navigate([ruta]); }

  volverPagHome() { this.router.navigate(['/doctor']); }
}