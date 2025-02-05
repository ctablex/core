import { describe, expect, expectTypeOf, it } from 'vitest';
import { access, Accessor } from './accessor';

describe('accessor', () => {
  it('should support null accessor', () => {
    type Obj = { a: number; b: { c: string } };

    const obj: Obj = { a: 5, b: { c: 'd' } };
    expect(access(obj, null)).toBeNull();
    expectTypeOf(access(obj, null)).toEqualTypeOf<null>();
  });

  it('should support path accessor', () => {
    type Obj = { a: number; b: { c: string } };

    const obj: Obj = { a: 5, b: { c: 'd' } };
    expect(access(obj, 'a')).toBe(5);
    expectTypeOf(access(obj, 'a')).toEqualTypeOf<number>();
    expect(access(obj, 'b')).toBe(obj.b);
    expectTypeOf(access(obj, 'b')).toEqualTypeOf<{ c: string }>();
    expect(access(obj, 'b.c')).toBe('d');
    expectTypeOf(access(obj, 'b.c')).toEqualTypeOf<string>();
  });

  it('should support fn accessor', () => {
    type Obj = { a: number; b: { c: string } };

    const obj: Obj = { a: 5, b: { c: 'd' } };
    expect(access(obj, (o) => o.a)).toBe(5);
    expectTypeOf(access(obj, (o) => o.a)).toEqualTypeOf<number>();
    expect(access(obj, (o) => o.b)).toBe(obj.b);
    expectTypeOf(access(obj, (o) => o.b)).toEqualTypeOf<{ c: string }>();
    expect(access(obj, (o) => o.b.c)).toBe('d');
    expectTypeOf(access(obj, (o) => o.b.c)).toEqualTypeOf<string>();
  });

  it('should support narrowed types in generic fn', () => {
    function fn<T>(t: T, a: Accessor<T, number>): number {
      return access<T, number>(t, a);
    }

    type Obj = {
      num: number;
      str: string;
      some: { five: 5; name: 'v' };
    };

    const obj: Obj = { num: 3, str: 'foo', some: { five: 5, name: 'v' } };

    expect(fn(obj, 'some.five')).toBe(5);
    expect(fn(obj, (o) => o.num)).toBe(5);
  });
});
