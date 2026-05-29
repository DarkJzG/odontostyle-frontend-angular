import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesCuentaPaciente } from './ajustesCuentaPaciente';

describe('AjustesCuentaPaciente', () => {
  let component: AjustesCuentaPaciente;
  let fixture: ComponentFixture<AjustesCuentaPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustesCuentaPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesCuentaPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
