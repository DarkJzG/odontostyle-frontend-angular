import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagHome } from './pagHome';

describe('PagHome', () => {
  let component: PagHome;
  let fixture: ComponentFixture<PagHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagHome],
    }).compileComponents();

    fixture = TestBed.createComponent(PagHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
