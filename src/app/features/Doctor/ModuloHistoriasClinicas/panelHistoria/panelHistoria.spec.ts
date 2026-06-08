import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHistoria } from './panel-historia';

describe('PanelHistoria', () => {
  let component: PanelHistoria;
  let fixture: ComponentFixture<PanelHistoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelHistoria],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelHistoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
