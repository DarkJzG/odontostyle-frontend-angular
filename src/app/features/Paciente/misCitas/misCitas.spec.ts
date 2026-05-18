import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCitas } from './misCitas';

describe('MisCitas', () => {
  let component: MisCitas;
  let fixture: ComponentFixture<MisCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCitas],
    }).compileComponents();

    fixture = TestBed.createComponent(MisCitas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
