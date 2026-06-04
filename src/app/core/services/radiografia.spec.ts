import { TestBed } from '@angular/core/testing';

import { Radiografia } from './radiografia';

describe('Radiografia', () => {
  let service: Radiografia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Radiografia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
