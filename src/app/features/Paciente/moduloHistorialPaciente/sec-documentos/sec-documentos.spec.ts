import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecDocumentos } from './sec-documentos';

describe('SecDocumentos', () => {
  let component: SecDocumentos;
  let fixture: ComponentFixture<SecDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecDocumentos],
    }).compileComponents();

    fixture = TestBed.createComponent(SecDocumentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
