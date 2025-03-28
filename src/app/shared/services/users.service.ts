import { inject, Injectable } from '@angular/core';
import { UserInterface } from '../types/user.interface';
import { UtilsService } from './utils.service';

@Injectable()
export class UsersService {
  utilsService = inject(UtilsService);

  users: UserInterface[] = [];

  addUser(user: UserInterface): void {
    this.users = [...this.users, user];
  }

  removeUser(userId: string): void {
    const updatedUsers = this.users.filter((user) => userId !== user.id);
    this.users = updatedUsers;
  }

  getUserNames(): string[] {
    return this.utilsService.pluck(this.users, 'name');
  }

  getUserNickname(user: UserInterface): string {
    return this.utilsService.getUserNickname(user.name);
  }
}
