import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWhatsapp } from './adminWhatsapp';

describe('AdminWhatsapp', () => {
  let component: AdminWhatsapp;
  let fixture: ComponentFixture<AdminWhatsapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWhatsapp],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWhatsapp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
