
//features/Doctor/ModuloPaciente/detallePaciente/fichaClinica/fichaClinica.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DetallePaciente } from '../detallePaciente';
import { Odontograma } from './odontograma/odontograma';

@Component({
  selector: 'app-ficha-clinica',
  standalone: true,
  imports: [CommonModule, MatIconModule, Odontograma],
  templateUrl: './fichaClinica.html',
  styleUrl: './fichaClinica.css'
})
export class FichaClinica {
  @Input() idUsuario: string = '';
  subPestanaActiva: string = 'historial';
  cambiarSubPestana(sub: string) {
    this.subPestanaActiva = sub;
  }
}