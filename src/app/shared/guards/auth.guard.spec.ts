import { TestBed, waitForAsync } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { CurrentUserService } from './currentUser.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('auth guard', () => {
  let currentUserServiceMock = {
    currentUser$: of<{ id: string } | null>(null),
  };
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CurrentUserService, useValue: currentUserServiceMock },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should return false for not logged user', waitForAsync(() => {
    jest.spyOn(router, 'navigateByUrl').mockImplementation();
    // because the authGuard is a function that has services injections, it should be tested in TestBed.runInInjectionContext()!
    // otherwise it won't work
    TestBed.runInInjectionContext(() => {
      return authGuard();
    }).subscribe((result) => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      expect(result).toBe(false);
    });
  }));

  it('should pass the auth guard', waitForAsync(() => {
    currentUserServiceMock.currentUser$ = of({ id: '1' });
    TestBed.runInInjectionContext(() => {
      return authGuard();
    }).subscribe((result) => {
      expect(result).toBe(true);
    });
  }));
});
