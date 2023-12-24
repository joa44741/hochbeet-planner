import { TestBed } from '@angular/core/testing';

import { HochbeetService } from './hochbeet.service';

describe('HochbeetService', () => {
  let service: HochbeetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HochbeetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
