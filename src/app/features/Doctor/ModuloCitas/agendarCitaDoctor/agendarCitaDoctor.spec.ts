import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarCitaDoctor } from './agendarCitaDoctor';

describe('AgendarCitaDoctor', () => {
  let component: AgendarCitaDoctor;
  let fixture: ComponentFixture<AgendarCitaDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarCitaDoctor],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendarCitaDoctor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
