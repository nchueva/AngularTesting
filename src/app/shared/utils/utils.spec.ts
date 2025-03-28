import { createUserNickname, errorText, pluck, range } from './utils';

describe('utils', () => {
  describe('range', () => {
    it('output correct range from 1 to 5', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    });
    it('output correct range from 41 to 44', () => {
      expect(range(41, 44)).toEqual([41, 42, 43]);
    });
  });
  describe('pluck', () => {
    it('returns correct id mapping', () => {
      const data = [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
        { id: 3, name: 'baz' },
      ];
      expect(pluck(data, 'id')).toEqual([1, 2, 3]);
    });
  });

  describe('createUserNickname', () => {
    it('creates user nickname', () => {
      expect(createUserNickname('Ron')).toEqual('Nor');
    });
    it('shows alert', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      createUserNickname('');
      expect(window.alert).toHaveBeenCalledWith(errorText);
      expect(createUserNickname('')).toEqual('');
    });
  });
});
