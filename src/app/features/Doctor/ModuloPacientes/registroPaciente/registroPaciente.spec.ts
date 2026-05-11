import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPaciente } from './registroPaciente';

describe('RegistroPaciente', () => {
  let component: RegistroPaciente;
  let fixture: ComponentFixture<RegistroPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
