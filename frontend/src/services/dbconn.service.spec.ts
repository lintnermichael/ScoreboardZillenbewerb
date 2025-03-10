import { TestBed } from '@angular/core/testing';

import { DbconnService } from './dbconn.service';

describe('DbconnService', () => {
  let service: DbconnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbconnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
