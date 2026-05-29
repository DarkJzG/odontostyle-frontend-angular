import { TestBed } from '@angular/core/testing';

import { HorarioDoctor } from './horario-doctor';

describe('HorarioDoctor', () => {
  let service: HorarioDoctor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioDoctor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
