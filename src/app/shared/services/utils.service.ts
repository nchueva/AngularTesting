import { Injectable } from '@angular/core';
import { createUserNickname, errorText } from '../utils/utils';

@Injectable()
export class UtilsService {
  range = (start: number, end: number): number[] => {
    return [...Array(end - start).keys()].map((el) => el + start);
  };

  pluck = (elements: any[], field: string) => {
    return elements.map((el) => el[field]);
  };

  getUserNickname(userName: string): string {
    if (!userName.trim()) {
      throw new Error(errorText);
    }
    return createUserNickname(userName);
  }
}
