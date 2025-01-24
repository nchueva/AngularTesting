import { TestBed } from '@angular/core/testing';
import { UserInterface } from '../../types/user.interface';
import { UsersService } from './rxjs-users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService],
    });

    usersService = TestBed.inject(UsersService);
  });

  it('creates UsersService', () => {
    expect(usersService).toBeTruthy();
  });

  describe('addUser', () => {
    it('should add a user', () => {
      const user: UserInterface = { id: '3', name: 'foo' };
      usersService.addUser(user);
      expect(usersService.users$.getValue()).toEqual([
        { id: '3', name: 'foo' },
      ]);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', () => {
      usersService.users$.next([{ id: '3', name: 'foo' }]);
      usersService.removeUser('3');
      expect(usersService.users$.getValue()).toEqual([]);
    });
  });
});
