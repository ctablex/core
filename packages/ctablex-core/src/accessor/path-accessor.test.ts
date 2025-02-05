import { describe, expect, expectTypeOf, it } from 'vitest';
import { accessByPath, PathAccessor } from './path-accessor';

function pathAccessor<T, R>(t: T): PathAccessor<T, R> {
  return '' as any;
}

describe('path accessor', () => {
  it('should support simple object', () => {
    type Obj = { a: number; b: string };

    const obj: Obj = { a: 5, b: 'c' };
    expect(accessByPath(obj, 'a')).toBe(5);
    expectTypeOf(accessByPath(obj, 'a')).toEqualTypeOf<number>();
    expect(accessByPath(obj, 'b')).toBe('c');
    expectTypeOf(accessByPath(obj, 'b')).toEqualTypeOf<string>();

    expectTypeOf(pathAccessor(obj)).toEqualTypeOf<'a' | 'b'>();
  });

  it('should support object with optional fields', () => {
    type Obj = { a?: number };

    const obj1: Obj = { a: 5 } as any;
    expect(accessByPath(obj1, 'a')).toBe(5);
    expectTypeOf(accessByPath(obj1, 'a')).toEqualTypeOf<number | undefined>();

    const obj2: Obj = {} as any;
    expect(accessByPath(obj2, 'a')).toBeUndefined();
    expectTypeOf(accessByPath(obj2, 'a')).toEqualTypeOf<number | undefined>();

    expectTypeOf(pathAccessor(obj2)).toEqualTypeOf<'a'>();
  });

  it('should support union', () => {
    type Obj = { a: number } | { b: string };

    const obj1: Obj = { a: 5 } as any;
    expect(accessByPath(obj1, 'a')).toBe(5);
    expect(accessByPath(obj1, 'b')).toBeUndefined();

    expectTypeOf(accessByPath(obj1, 'a')).toEqualTypeOf<number | undefined>();
    expectTypeOf(accessByPath(obj1, 'b')).toEqualTypeOf<string | undefined>();

    const obj2: Obj = { b: 'value' } as any;
    expect(accessByPath(obj2, 'a')).toBeUndefined();
    expect(accessByPath(obj2, 'b')).toBe('value');

    expectTypeOf(accessByPath(obj2, 'a')).toEqualTypeOf<number | undefined>();
    expectTypeOf(accessByPath(obj2, 'b')).toEqualTypeOf<string | undefined>();

    expectTypeOf(pathAccessor(obj2)).toEqualTypeOf<'a' | 'b'>();
  });

  it('should support object with array fields', () => {
    type Obj = { a: number; b: string[] };

    const obj: Obj = { a: 5, b: ['x', 'y'] };
    expect(accessByPath(obj, 'a')).toBe(5);
    expect(accessByPath(obj, 'b')).toBe(obj.b);
    expectTypeOf(accessByPath(obj, 'a')).toEqualTypeOf<number>();
    expectTypeOf(accessByPath(obj, 'b')).toEqualTypeOf<string[]>();

    expectTypeOf(pathAccessor(obj)).toEqualTypeOf<'a' | 'b'>();
  });

  it('should support nested object', () => {
    type Obj = {
      a: number;
      nested: {
        value: string;
      };
    };

    const obj: Obj = { a: 5, nested: { value: 'some value' } };
    expect(accessByPath(obj, 'a')).toBe(5);
    expect(accessByPath(obj, 'nested')).toBe(obj.nested);
    expect(accessByPath(obj, 'nested.value')).toBe('some value');

    expectTypeOf(accessByPath(obj, 'a')).toEqualTypeOf<number>();
    expectTypeOf(accessByPath(obj, 'nested')).toEqualTypeOf<{
      value: string;
    }>();
    expectTypeOf(accessByPath(obj, 'nested.value')).toEqualTypeOf<string>();

    expectTypeOf(pathAccessor(obj)).toEqualTypeOf<
      'a' | 'nested' | 'nested.value'
    >();
  });

  it('should support nested object with optional fields', () => {
    type Obj = {
      optional?: {
        value: string;
      };
      nullable: {
        other: number;
      } | null;
    };

    const obj: Obj = { nullable: null };
    expect(accessByPath(obj, 'optional')).toBeUndefined();
    expect(accessByPath(obj, 'optional.value')).toBeUndefined();
    expect(accessByPath(obj, 'nullable')).toBeNull();
    expect(accessByPath(obj, 'nullable.other')).toBeUndefined();

    expectTypeOf(accessByPath(obj, 'optional')).toEqualTypeOf<
      { value: string } | undefined
    >();
    expectTypeOf(accessByPath(obj, 'optional.value')).toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf(accessByPath(obj, 'nullable')).toEqualTypeOf<{
      other: number;
    } | null>();
    expectTypeOf(accessByPath(obj, 'nullable.other')).toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf(pathAccessor(obj)).toEqualTypeOf<
      'optional' | 'optional.value' | 'nullable' | 'nullable.other'
    >();
  });

  it('should support nested object with union fields', () => {
    type Obj = {
      union: { a: string } | { b: number };
    };

    const obj: Obj = { union: { a: 'value' } };
    expect(accessByPath(obj, 'union')).toBe(obj.union);
    expect(accessByPath(obj, 'union.a')).toBe('value');
    expect(accessByPath(obj, 'union.b')).toBeUndefined();

    expectTypeOf(accessByPath(obj, 'union')).toEqualTypeOf<
      { a: string } | { b: number }
    >();
    expectTypeOf(accessByPath(obj, 'union.a')).toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf(accessByPath(obj, 'union.b')).toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf(pathAccessor(obj)).toEqualTypeOf<
      'union' | 'union.a' | 'union.b'
    >();
  });

  it('should support types for union paths', () => {
    type Obj = {
      a: 1;
      b: 2;
      c: { x: 3; y: 4 };
    };

    const obj: Obj = {
      a: 1,
      b: 2,
      c: { x: 3, y: 4 },
    };

    let k_a_or_b: 'a' | 'b' = 'a' as any;
    expectTypeOf(accessByPath(obj, k_a_or_b)).toEqualTypeOf<1 | 2>();
    let k_a_or_cx: 'a' | 'c.x' = 'a' as any;
    expectTypeOf(accessByPath(obj, k_a_or_cx)).toEqualTypeOf<1 | 3>();
  });

  it('should support any type', () => {
    type Obj = {
      a: any;
    };

    let obj1: Obj = { a: 1 } as any;
    expectTypeOf(accessByPath(obj1, 'a')).toEqualTypeOf<any>();
    expectTypeOf(pathAccessor(obj1)).toEqualTypeOf<'a' | `a.${string}`>();

    let obj2: Obj = { a: { b: 1 } } as any;
    expectTypeOf(accessByPath(obj2, 'a.b')).toEqualTypeOf<any>();
    expectTypeOf(pathAccessor(obj2)).toEqualTypeOf<'a' | `a.${string}`>();

    let obj3: any = { a: 1 } as any;
    expectTypeOf(accessByPath(obj3, 'a')).toEqualTypeOf<any>();
    expectTypeOf(pathAccessor(obj3)).toEqualTypeOf<string>();
  });

  it('should support unknown type', () => {
    type Obj = {
      a: unknown;
    };

    let obj1: Obj = { a: 1 } as any;
    expectTypeOf(accessByPath(obj1, 'a')).toEqualTypeOf<unknown>();
    expectTypeOf(pathAccessor(obj1)).toEqualTypeOf<'a'>();

    let obj3: unknown = { a: 1 } as any;

    // @ts-expect-error
    accessByPath(obj3, 'a');
    expectTypeOf(pathAccessor(obj3)).toEqualTypeOf<never>();
  });

  it('should support narrowed types', () => {
    type Obj = {
      a: number;
      b: string;
      five: 5;
      optional?: number;
    };

    const obj: Obj = { a: 1, b: 'c', five: 5 };

    expectTypeOf(pathAccessor<Obj, number>(obj)).toEqualTypeOf<'a' | 'five'>();
    expectTypeOf(pathAccessor<Obj, number | undefined>(obj)).toEqualTypeOf<
      'a' | 'five' | 'optional'
    >();

    function fn(t: Obj, a: PathAccessor<Obj, number>): number {
      return accessByPath<Obj, number>(t, a);
    }

    expect(fn(obj, 'a')).toBe(1);
  });

  it('should support narrowed types in nested', () => {
    type Obj = {
      num: number;
      str: string;
      some: { five: 5; name: 'v' };
    };

    const obj: Obj = { num: 3, str: 'foo', some: { five: 5, name: 'v' } };

    expectTypeOf(pathAccessor<Obj, number>(obj)).toEqualTypeOf<
      'num' | 'some.five'
    >();
    expectTypeOf(pathAccessor<Obj, number | boolean>(obj)).toEqualTypeOf<
      'num' | 'some.five'
    >();
    expectTypeOf(pathAccessor<Obj, number | string>(obj)).toEqualTypeOf<
      'num' | 'str' | 'some.five' | 'some.name'
    >();
  });

  it('should support narrowed types in nested with optional', () => {
    type Obj = {
      num: number;
      nullable: number | null;
      optional?: { five: 5; four?: 4; name: 'v' };
      deep_null: { six: 6 } | null;
    };

    const obj: Obj = { num: 3, nullable: null, deep_null: null };

    expectTypeOf(pathAccessor<Obj, number>(obj)).toEqualTypeOf<'num'>();
    expectTypeOf(pathAccessor<Obj, number | null>(obj)).toEqualTypeOf<
      'num' | 'nullable'
    >();
    expectTypeOf(pathAccessor<Obj, number | undefined>(obj)).toEqualTypeOf<
      'num' | 'optional.five' | 'optional.four' | 'deep_null.six'
    >();
    expectTypeOf(
      pathAccessor<Obj, number | null | undefined>(obj),
    ).toEqualTypeOf<
      'num' | 'nullable' | 'optional.five' | 'optional.four' | 'deep_null.six'
    >();
  });

  it('should support narrowed types in nested with union', () => {
    type Obj =
      | {
          union: { a: number } | { b: string };
        }
      | { x: number }
      | { y: string };

    const obj: Obj = { x: 5 };

    expectTypeOf(pathAccessor<Obj, number>(obj)).toEqualTypeOf<
      'x' | 'union.a'
    >();
    expectTypeOf(pathAccessor<Obj, number | boolean>(obj)).toEqualTypeOf<
      'x' | 'union.a'
    >();
    expectTypeOf(pathAccessor<Obj, number | string>(obj)).toEqualTypeOf<
      'x' | 'y' | 'union.a' | 'union.b'
    >();
  });

  it('should support narrowed types in generic fn', () => {
    function fn<T>(t: T, a: PathAccessor<T, number>): number {
      return accessByPath<T, number>(t, a);
    }

    type Obj = {
      num: number;
      str: string;
      some: { five: 5; name: 'v' };
    };

    const obj: Obj = { num: 3, str: 'foo', some: { five: 5, name: 'v' } };
    expect(fn(obj, 'some.five')).toBe(5);
  });
});
