import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPaciente } from './perfilPaciente';

describe('PerfilPaciente', () => {
  let component: PerfilPaciente;
  let fixture: ComponentFixture<PerfilPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
