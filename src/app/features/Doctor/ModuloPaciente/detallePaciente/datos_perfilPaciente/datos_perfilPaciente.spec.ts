import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPerfilPaciente } from './datos_perfilPaciente';

describe('DatosPerfilPaciente', () => {
  let component: DatosPerfilPaciente;
  let fixture: ComponentFixture<DatosPerfilPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPerfilPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPerfilPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
