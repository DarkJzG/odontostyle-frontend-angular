import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialClinicoPaciente } from './historialClinicoPaciente';

describe('HistorialClinicoPaciente', () => {
  let component: HistorialClinicoPaciente;
  let fixture: ComponentFixture<HistorialClinicoPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialClinicoPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialClinicoPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
