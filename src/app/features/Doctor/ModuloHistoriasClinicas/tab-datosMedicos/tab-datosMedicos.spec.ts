import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosMedicos } from './tab-datosMedicos';

describe('DatosMedicos', () => {
  let component: DatosMedicos;
  let fixture: ComponentFixture<DatosMedicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosMedicos],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMedicos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
