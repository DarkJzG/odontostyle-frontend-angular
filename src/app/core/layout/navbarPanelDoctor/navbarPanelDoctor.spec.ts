import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPanelDoctor } from './navbarPanelDoctor';

describe('NavbarPanelDoctor', () => {
  let component: NavbarPanelDoctor;
  let fixture: ComponentFixture<NavbarPanelDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPanelDoctor],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarPanelDoctor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
