import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabRadiografias } from './tab-radiografias';

describe('TabRadiografias', () => {
  let component: TabRadiografias;
  let fixture: ComponentFixture<TabRadiografias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabRadiografias],
    }).compileComponents();

    fixture = TestBed.createComponent(TabRadiografias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
