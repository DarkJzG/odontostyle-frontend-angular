import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagHomePaciente } from './pagHomePaciente';

describe('PagHomePaciente', () => {
  let component: PagHomePaciente;
  let fixture: ComponentFixture<PagHomePaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagHomePaciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagHomePaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
