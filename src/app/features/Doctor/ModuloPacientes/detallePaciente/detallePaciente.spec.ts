import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePaciente } from './detallePaciente';

describe('DetallePaciente', () => {
  let component: DetallePaciente;
  let fixture: ComponentFixture<DetallePaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
