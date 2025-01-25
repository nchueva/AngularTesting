import { TestBed, waitForAsync } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TagInterface } from '../../types/tag.interface';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('creates service', () => {
    expect(apiService).toBeTruthy();
  });

  describe('getTags', () => {
    // approach 1
    it('should get tags from http', () => {
      let tags: TagInterface[] | undefined;

      apiService.getTags().subscribe((response) => {
        // if it's not waitForAsync, the expect can't be placed inside of the subscription
        tags = response;
      });

      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush([{ id: '1', name: 'foo' }]);
      expect(tags).toEqual([{ id: '1', name: 'foo' }]);
    });

    // approach 2
    it('should return a list of tags  with waitAsyncFrom', waitForAsync(() => {
      apiService.getTags().subscribe((res) => {
        // expect is placed inside the subscription
        expect(res).toEqual([{ id: '1', name: 'foo' }]);
      });
      const request = httpTestingController.expectOne(
        'http://localhost:3004/tags'
      );
      request.flush([{ id: '1', name: 'foo' }]);
    }));
  });

  describe('createTag', () => {
    it('should create a tag', () => {
      let tag: TagInterface | undefined;
      apiService.createTag('foo').subscribe((response) => {
        tag = response;
      });

      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush({ id: '1', name: 'foo' });

      expect(tag).toEqual({ id: '1', name: 'foo' });
    });

    it('passes correct body', () => {
      let tag: TagInterface | undefined;
      apiService.createTag('foo').subscribe((response) => {
        tag = response;
      });

      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush({ id: '1', name: 'foo' });

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ name: 'foo' });
    });

    it('throws an error', () => {
      let actualError: HttpErrorResponse | undefined;
      apiService.createTag('foo').subscribe({
        next: () => {
          return fail('Success should not be called');
        },
        error: (err) => (actualError = err),
      });

      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush('Server error', {
        status: 422,
        statusText: 'Unprocessable entity',
      });

      if (!actualError) {
        throw new Error('Error needs to be defined');
      }

      expect(actualError.status).toEqual(422);
      expect(actualError.statusText).toEqual('Unprocessable entity');
    });
  });
});
