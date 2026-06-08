import { TestBed } from '@angular/core/testing';

import { WhatsappConfig } from './whatsappConfig';

describe('WhatsappConfig', () => {
  let service: WhatsappConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
