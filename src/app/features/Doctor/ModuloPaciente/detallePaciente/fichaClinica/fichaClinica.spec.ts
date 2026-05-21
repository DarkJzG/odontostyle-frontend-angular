import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaClinica } from './fichaClinica';

describe('FichaClinica', () => {
  let component: FichaClinica;
  let fixture: ComponentFixture<FichaClinica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaClinica],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaClinica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
