import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabRecetas } from './tab-recetas';

describe('TabRecetas', () => {
  let component: TabRecetas;
  let fixture: ComponentFixture<TabRecetas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabRecetas],
    }).compileComponents();

    fixture = TestBed.createComponent(TabRecetas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
