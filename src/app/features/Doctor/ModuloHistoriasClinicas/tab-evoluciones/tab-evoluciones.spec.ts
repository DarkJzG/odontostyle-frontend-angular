import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabEvoluciones } from './tab-evoluciones';

describe('TabEvoluciones', () => {
  let component: TabEvoluciones;
  let fixture: ComponentFixture<TabEvoluciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabEvoluciones],
    }).compileComponents();

    fixture = TestBed.createComponent(TabEvoluciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
