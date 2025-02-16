import { TestBed } from '@angular/core/testing';

import { TestingPracticeService } from './testing-practice.service';

describe('TestingPracticeService', () => {
  let service: TestingPracticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestingPracticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
