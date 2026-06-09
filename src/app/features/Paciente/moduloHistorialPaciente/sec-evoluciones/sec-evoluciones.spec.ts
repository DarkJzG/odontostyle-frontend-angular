import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecEvoluciones } from './sec-evoluciones';

describe('SecEvoluciones', () => {
  let component: SecEvoluciones;
  let fixture: ComponentFixture<SecEvoluciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecEvoluciones],
    }).compileComponents();

    fixture = TestBed.createComponent(SecEvoluciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
