import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionHorario } from './configuracionHorario';

describe('ConfiguracionHorario', () => {
  let component: ConfiguracionHorario;
  let fixture: ComponentFixture<ConfiguracionHorario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionHorario],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracionHorario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
