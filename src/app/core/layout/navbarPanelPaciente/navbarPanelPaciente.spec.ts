import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPanelPaciente } from './navbarPanelPaciente';

describe('NavbarPanelPaciente', () => {
  let component: NavbarPanelPaciente;
  let fixture: ComponentFixture<NavbarPanelPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPanelPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarPanelPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
