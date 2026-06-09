import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecRecetas } from './sec-recetas';

describe('SecRecetas', () => {
  let component: SecRecetas;
  let fixture: ComponentFixture<SecRecetas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecRecetas],
    }).compileComponents();

    fixture = TestBed.createComponent(SecRecetas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
