import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarHistoria } from './buscarHistoria';

describe('BuscarHistoria', () => {
  let component: BuscarHistoria;
  let fixture: ComponentFixture<BuscarHistoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarHistoria],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarHistoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
