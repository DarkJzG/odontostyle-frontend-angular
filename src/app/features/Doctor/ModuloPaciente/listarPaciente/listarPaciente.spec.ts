import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPaciente } from './listarPaciente';

describe('ListaPaciente', () => {
  let component: ListaPaciente;
  let fixture: ComponentFixture<ListaPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
