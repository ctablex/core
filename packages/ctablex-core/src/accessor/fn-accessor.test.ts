import { describe, expect, expectTypeOf, it } from 'vitest';
import { accessByFn, type FnAccessor } from './fn-accessor';

describe('fn accessor', () => {
  it('should support simple object with inline fn', () => {
    type Obj = { a: number; b: string };

    const obj: Obj = { a: 5, b: 'c' };
    expect(accessByFn(obj, (o) => o.a)).toBe(5);
    expectTypeOf(accessByFn(obj, (o) => o.a)).toEqualTypeOf<number>();
  });

  it('should support simple object with defined fn', () => {
    type Obj = { a: number; b: string };

    const obj: Obj = { a: 5, b: 'c' };
    const fn = (o: Obj) => o.a;
    expect(accessByFn(obj, fn)).toBe(5);
    expectTypeOf(accessByFn(obj, fn)).toEqualTypeOf<number>();
  });

  it('should support simple object with satisfies fn', () => {
    type Obj = { a: number; b: string };

    const obj: Obj = { a: 5, b: 'c' };
    const fn = ((o) => o.a) satisfies FnAccessor<Obj>;
    expect(accessByFn(obj, fn)).toBe(5);
    expectTypeOf(accessByFn(obj, fn)).toEqualTypeOf<number>();
  });

  it('should support overloading fn', () => {
    function fn(a: number): `n: ${number}`;
    function fn(a: string): `s: ${string}`;
    function fn(a: number | string): string {
      if (typeof a === 'number') {
        return `n: ${a}`;
      }
      if (typeof a === 'string') {
        return `s: ${a}`;
      }
      throw new Error('unknown type');
    }

    expect(accessByFn(5, fn)).toBe('n: 5');
    expectTypeOf(fn(5)).toEqualTypeOf<`n: ${number}`>();
    expectTypeOf(accessByFn(5, fn)).toEqualTypeOf<`n: ${number}`>();

    expect(accessByFn('x', fn)).toBe('s: x');
    expectTypeOf(fn('x')).toEqualTypeOf<`s: ${string}`>();
    expectTypeOf(accessByFn('x', fn)).toEqualTypeOf<`s: ${string}`>();
  });
});
