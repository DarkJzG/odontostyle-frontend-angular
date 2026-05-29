import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarCita } from './agendarCita';

describe('AgendarCita', () => {
  let component: AgendarCita;
  let fixture: ComponentFixture<AgendarCita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarCita],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendarCita);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
