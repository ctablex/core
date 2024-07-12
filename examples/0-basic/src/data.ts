import faker from 'faker';
import { Item } from './types';

export function generateData(n: number, seed: number = 1): Item[] {
  faker.seed(seed);
  return Array.from(Array(n)).map((_, index) => {
    return {
      id: index + '',
      name: faker.commerce.productName(),
      price: faker.datatype.number(1000),
      count: faker.datatype.number(20),
    };
  });
}
