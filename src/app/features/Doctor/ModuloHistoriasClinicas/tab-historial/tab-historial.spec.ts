import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabHistorial } from './tab-historial';

describe('TabHistorial', () => {
  let component: TabHistorial;
  let fixture: ComponentFixture<TabHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabHistorial],
    }).compileComponents();

    fixture = TestBed.createComponent(TabHistorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
