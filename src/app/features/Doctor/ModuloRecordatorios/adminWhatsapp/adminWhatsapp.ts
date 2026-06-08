//src/app/features/Doctor/ModuloRecordatorios/adminWhastapp/adminWhastapp.ts
import { Component, OnInit, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarPanelDoctor } from '../../../../core/layout/navbarPanelDoctor/navbarPanelDoctor';
import { WhatsappConfig } from '../../../../core/services/whatsappConfig';

@Component({
  selector: 'app-admin-whatsapp',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NavbarPanelDoctor],
  templateUrl: './adminWhatsapp.html',
  styleUrl: './adminWhatsapp.css'
})
export class AdminWhatsapp implements OnInit {
  private whatsappService = inject(WhatsappConfig);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  @ViewChild('editor24h') editor24h!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('editor1h') editor1h!: ElementRef<HTMLTextAreaElement>;

  config: any = { mensaje24h: '', mensaje1h: '' };
  cargando: boolean = true;
  guardando: boolean = false;
  campoActivo: '24h' | '1h' = '24h'; // Para saber dónde inyectar la etiqueta

  etiquetasMagicas = [
    { tag: '[NOMBRE_PACIENTE]', desc: 'Se reemplaza por los nombres del paciente.' },
    { tag: '[HORA_CITA]', desc: 'La hora programada (Ej: 15:30).' }
  ];

  ngOnInit() {
    this.whatsappService.obtenerConfiguracion().subscribe({
      next: (data) => {
        this.config = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  setCampoActivo(campo: '24h' | '1h') {
    this.campoActivo = campo;
  }

  inyectarEtiqueta(tag: string) {
    const textarea = this.campoActivo === '24h' ? this.editor24h.nativeElement : this.editor1h.nativeElement;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    const textoActual = this.campoActivo === '24h' ? this.config.mensaje24h : this.config.mensaje1h;
    const nuevoTexto = textoActual.substring(0, startPos) + tag + textoActual.substring(endPos, textoActual.length);

    if (this.campoActivo === '24h') this.config.mensaje24h = nuevoTexto;
    else this.config.mensaje1h = nuevoTexto;

    this.cdr.detectChanges();
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + tag.length, startPos + tag.length);
    }, 50);
  }

  guardar() {
    this.guardando = true;
    this.whatsappService.guardarConfiguracion(this.config).subscribe({
      next: () => {
        this.guardando = false;
        alert('Configuración de WhatsApp actualizada exitosamente.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.guardando = false;
        alert('Error al guardar la configuración.');
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/doctor']);
  }
}