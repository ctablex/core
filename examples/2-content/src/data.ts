import faker from 'faker';
import { Item } from './types';

export function generateData(n: number, seed: number = 1): Item[] {
  faker.seed(seed);
  return Array.from(Array(n)).map((_, index) => {
    return {
      id: index + '',
      name: faker.commerce.productName(),
      price: faker.datatype.number(9999) + 1,
      count: faker.datatype.number(19) + 1,
      freeDelivery: faker.datatype.boolean(),
    };
  });
}
