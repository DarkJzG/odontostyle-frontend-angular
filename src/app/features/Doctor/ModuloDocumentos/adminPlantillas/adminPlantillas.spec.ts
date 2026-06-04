import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlantillas } from './adminPlantillas';

describe('AdminPlantillas', () => {
  let component: AdminPlantillas;
  let fixture: ComponentFixture<AdminPlantillas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPlantillas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPlantillas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
