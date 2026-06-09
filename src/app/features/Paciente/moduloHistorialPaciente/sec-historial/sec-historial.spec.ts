import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecHistorial } from './sec-historial';

describe('SecHistorial', () => {
  let component: SecHistorial;
  let fixture: ComponentFixture<SecHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecHistorial],
    }).compileComponents();

    fixture = TestBed.createComponent(SecHistorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
