import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecRadiografias } from './sec-radiografias';

describe('SecRadiografias', () => {
  let component: SecRadiografias;
  let fixture: ComponentFixture<SecRadiografias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecRadiografias],
    }).compileComponents();

    fixture = TestBed.createComponent(SecRadiografias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
