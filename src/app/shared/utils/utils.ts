export const range = (start: number, end: number): number[] => {
  return [...Array(end - start).keys()].map((el) => el + start);
};

export const pluck = (elements: any[], field: string) => {
  return elements.map((el) => el[field]);
};

export const errorText = 'there is an empty name';

export function createUserNickname(userName: string): string {
  let splitArray = userName.trim();
  if (!splitArray) {
    alert(errorText);
    return '';
  }
  const nameArray = splitArray.toLowerCase().split(''); // convert into array
  const result2 = nameArray.reverse();
  result2[0] = result2[0].toUpperCase();
  console.log('result2', result2);
  return result2.join('');
}
