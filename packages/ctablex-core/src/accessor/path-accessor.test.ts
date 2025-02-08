import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  accessByPath,
  accessByPathTo,
  PathAccessor,
  PathAccessorTo,
} from './path-accessor';

function pathAccessor<T>(t: T): PathAccessor<T> {
  return '' as any;
}

function pathAccessorTo<T, R>(t: T): PathAccessorTo<T, R> {
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

  it('should support object with tuple fields', () => {
    type Obj = { a: number; b: [string, number, { x: 4 }] };

    const obj: Obj = { a: 5, b: ['x', 5, { x: 4 }] };
    expect(accessByPath(obj, 'a')).toBe(5);
    expect(accessByPath(obj, 'b')).toBe(obj.b);
    expectTypeOf(accessByPath(obj, 'a')).toEqualTypeOf<number>();
    expectTypeOf(accessByPath(obj, 'b')).toEqualTypeOf<
      [string, number, { x: 4 }]
    >();

    expectTypeOf(pathAccessor(obj)).toEqualTypeOf<'a' | 'b' | 'b.2.x'>();
  });

  it('should support self referenced types', () => {
    type Obj = { a?: Obj; b: number };
    const obj: Obj = { a: { b: 6 }, b: 5 };
    expect(accessByPath(obj, 'a')).toBe(obj.a);
    expect(accessByPath(obj, 'b')).toBe(obj.b);
    expectTypeOf(accessByPath(obj, 'a')).toEqualTypeOf<Obj | undefined>();
    expectTypeOf(accessByPath(obj, 'b')).toEqualTypeOf<number>();
    expectTypeOf(accessByPath(obj, 'a.a')).toEqualTypeOf<Obj | undefined>();
    expectTypeOf(accessByPath(obj, 'a.b')).toEqualTypeOf<number | undefined>();

    expectTypeOf(pathAccessor(obj)).toEqualTypeOf<
      | 'a'
      | 'b'
      | 'a.a'
      | 'a.b'
      | 'a.a.a'
      | 'a.a.b'
      | 'a.a.a.a'
      | 'a.a.a.b'
      | 'a.a.a.a.a'
      | 'a.a.a.a.b'
    >();
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
    expectTypeOf(pathAccessor(obj1)).toEqualTypeOf<'a' | `a.${string}`>();

    let obj3: unknown = { a: 1 } as any;

    accessByPath(obj3, 'a');
    expectTypeOf(pathAccessor(obj3)).toEqualTypeOf<string>();
  });

  describe('type narrowing', () => {
    it('should support narrowed types', () => {
      type Obj = {
        a: number;
        b: string;
        five: 5;
        optional?: number;
      };

      const obj: Obj = { a: 1, b: 'c', five: 5 };

      expectTypeOf(pathAccessorTo<Obj, number>(obj)).toEqualTypeOf<
        'a' | 'five'
      >();
      expectTypeOf(pathAccessorTo<Obj, number | boolean>(obj)).toEqualTypeOf<
        'a' | 'five'
      >();
      expectTypeOf(pathAccessorTo<Obj, number | undefined>(obj)).toEqualTypeOf<
        'a' | 'five' | 'optional'
      >();

      function fn(t: Obj, a: PathAccessorTo<Obj, number>): number {
        return accessByPathTo<number, Obj>(t, a);
      }

      expect(fn(obj, 'a')).toBe(1);
    });

    it('should support object with tuple fields', () => {
      type Obj = { a: number; b: [string, number, { x: 4 }] };

      const obj: Obj = { a: 5, b: ['x', 5, { x: 4 }] };
      expect(accessByPath(obj, 'a')).toBe(5);
      expect(accessByPath(obj, 'b')).toBe(obj.b);
      expectTypeOf(accessByPath(obj, 'a')).toEqualTypeOf<number>();
      expectTypeOf(accessByPath(obj, 'b')).toEqualTypeOf<
        [string, number, { x: 4 }]
      >();

      expectTypeOf(pathAccessor(obj)).toEqualTypeOf<'a' | 'b' | 'b.2.x'>();
    });

    it('should support self referenced types', () => {
      type Obj = { a?: Obj; b: number };
      const obj: Obj = { a: { b: 6 }, b: 5 };
      expect(accessByPathTo<number, Obj>(obj, 'b')).toBe(obj.b);
      expectTypeOf(
        accessByPathTo<number, Obj>(obj, 'b'),
      ).toEqualTypeOf<number>();
      expectTypeOf(
        accessByPathTo<number | undefined, Obj>(obj, 'a.b'),
      ).toEqualTypeOf<number | undefined>();

      expectTypeOf(pathAccessorTo<Obj, number>(obj)).toEqualTypeOf<'b'>();
      expectTypeOf(pathAccessorTo<Obj, number | undefined>(obj)).toEqualTypeOf<
        'b' | 'a.b' | 'a.a.b' | 'a.a.a.b' | 'a.a.a.a.b'
      >();
    });

    it('should support narrowed types in nested', () => {
      type Obj = {
        num: number;
        str: string;
        some: { five: 5; name: 'v' };
      };

      const obj: Obj = { num: 3, str: 'foo', some: { five: 5, name: 'v' } };

      expectTypeOf(pathAccessorTo<Obj, number>(obj)).toEqualTypeOf<
        'num' | 'some.five'
      >();
      expectTypeOf(pathAccessorTo<Obj, number | boolean>(obj)).toEqualTypeOf<
        'num' | 'some.five'
      >();
      expectTypeOf(pathAccessorTo<Obj, number | string>(obj)).toEqualTypeOf<
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

      expectTypeOf(pathAccessorTo<Obj, number>(obj)).toEqualTypeOf<'num'>();
      expectTypeOf(pathAccessorTo<Obj, number | null>(obj)).toEqualTypeOf<
        'num' | 'nullable'
      >();
      expectTypeOf(pathAccessorTo<Obj, number | undefined>(obj)).toEqualTypeOf<
        'num' | 'optional.five' | 'optional.four' | 'deep_null.six'
      >();
      expectTypeOf(
        pathAccessorTo<Obj, number | null | undefined>(obj),
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

      expectTypeOf(pathAccessorTo<Obj, number | undefined>(obj)).toEqualTypeOf<
        'x' | 'union.a'
      >();
      expectTypeOf(
        pathAccessorTo<Obj, number | boolean | undefined>(obj),
      ).toEqualTypeOf<'x' | 'union.a'>();
      expectTypeOf(
        pathAccessorTo<Obj, number | string | undefined>(obj),
      ).toEqualTypeOf<'x' | 'y' | 'union.a' | 'union.b'>();
    });

    it('should support narrowed types in generic fn', () => {
      function fn<T>(t: T, a: PathAccessorTo<T, number>): number {
        return accessByPathTo<number, T>(t, a);
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
});
