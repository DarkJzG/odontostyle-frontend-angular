import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabOdontograma } from './tab-odontograma';

describe('TabOdontograma', () => {
  let component: TabOdontograma;
  let fixture: ComponentFixture<TabOdontograma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabOdontograma],
    }).compileComponents();

    fixture = TestBed.createComponent(TabOdontograma);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
