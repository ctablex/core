import { describe, expect, expectTypeOf, it } from 'vitest';
import { accessByKey, KeyAccessor } from './key-accessor';

function keyAccessor<T>(t: T): KeyAccessor<T> {
  return '' as any;
}

describe('key accessor', () => {
  it('should support simple object', () => {
    type Obj = { a: number; b: string };

    const obj: Obj = { a: 5, b: 'c' };
    expect(accessByKey(obj, 'a')).toBe(5);
    expectTypeOf(accessByKey(obj, 'a')).toEqualTypeOf<number>();
    expect(accessByKey(obj, 'b')).toBe('c');
    expectTypeOf(accessByKey(obj, 'b')).toEqualTypeOf<string>();

    expectTypeOf(keyAccessor(obj)).toEqualTypeOf<'a' | 'b'>();
  });

  it('should support object with optional fields', () => {
    type Obj = { a?: number };

    const obj1: Obj = { a: 5 } as any;
    expect(accessByKey(obj1, 'a')).toBe(5);
    expectTypeOf(accessByKey(obj1, 'a')).toEqualTypeOf<number | undefined>();

    const obj2: Obj = {} as any;
    expect(accessByKey(obj2, 'a')).toBeUndefined();
    expectTypeOf(accessByKey(obj2, 'a')).toEqualTypeOf<number | undefined>();

    expectTypeOf(keyAccessor(obj2)).toEqualTypeOf<'a'>();
  });

  it('should support union', () => {
    type Obj = { a: number } | { b: string };

    const obj1: Obj = { a: 5 } as any;
    expect(accessByKey(obj1, 'a')).toBe(5);
    expect(accessByKey(obj1, 'b')).toBeUndefined();

    expectTypeOf(accessByKey(obj1, 'a')).toEqualTypeOf<number | undefined>();
    expectTypeOf(accessByKey(obj1, 'b')).toEqualTypeOf<string | undefined>();

    const obj2: Obj = { b: 'value' } as any;
    expect(accessByKey(obj2, 'a')).toBeUndefined();
    expect(accessByKey(obj2, 'b')).toBe('value');

    expectTypeOf(accessByKey(obj2, 'a')).toEqualTypeOf<number | undefined>();
    expectTypeOf(accessByKey(obj2, 'b')).toEqualTypeOf<string | undefined>();

    expectTypeOf(keyAccessor(obj2)).toEqualTypeOf<'a' | 'b'>();
  });

  it('should support object with array fields', () => {
    type Obj = { a: number; b: string[] };

    const obj: Obj = { a: 5, b: ['x', 'y'] };
    expect(accessByKey(obj, 'a')).toBe(5);
    expect(accessByKey(obj, 'b')).toBe(obj.b);
    expectTypeOf(accessByKey(obj, 'a')).toEqualTypeOf<number>();
    expectTypeOf(accessByKey(obj, 'b')).toEqualTypeOf<string[]>();

    expectTypeOf(keyAccessor(obj)).toEqualTypeOf<'a' | 'b'>();
  });

  it('should support first layer of nested object', () => {
    type Obj = {
      a: number;
      nested: {
        value: string;
      };
    };

    const obj: Obj = { a: 5, nested: { value: 'some value' } };
    expect(accessByKey(obj, 'a')).toBe(5);
    expect(accessByKey(obj, 'nested')).toBe(obj.nested);

    expectTypeOf(accessByKey(obj, 'a')).toEqualTypeOf<number>();
    expectTypeOf(accessByKey(obj, 'nested')).toEqualTypeOf<{
      value: string;
    }>();

    expectTypeOf(keyAccessor(obj)).toEqualTypeOf<'a' | 'nested'>();
  });

  it('should support types for union paths', () => {
    type Obj = {
      a: 1;
      b: 2;
      c: 3;
    };

    const obj: Obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    let k_a_or_b: 'a' | 'b' = 'a' as any;
    expectTypeOf(accessByKey(obj, k_a_or_b)).toEqualTypeOf<1 | 2>();
    let k_a_or_c: 'a' | 'c' = 'a' as any;
    expectTypeOf(accessByKey(obj, k_a_or_c)).toEqualTypeOf<1 | 3>();
  });
  it('should support any type', () => {
    type Obj = {
      a: any;
    };

    let obj1: Obj = { a: 1 } as any;
    expectTypeOf(accessByKey(obj1, 'a')).toEqualTypeOf<any>();
    expectTypeOf(keyAccessor(obj1)).toEqualTypeOf<'a'>();

    let obj3: any = { a: 1 } as any;
    expectTypeOf(accessByKey(obj3, 'a')).toEqualTypeOf<any>();
    expectTypeOf(keyAccessor(obj3)).toEqualTypeOf<string>();
  });

  it('should support unknown type', () => {
    type Obj = {
      a: unknown;
    };

    let obj1: Obj = { a: 1 } as any;
    expectTypeOf(accessByKey(obj1, 'a')).toEqualTypeOf<unknown>();
    expectTypeOf(keyAccessor(obj1)).toEqualTypeOf<'a'>();

    let obj3: unknown = { a: 1 } as any;

    // @ts-expect-error
    accessByKey(obj3, 'a');
    expectTypeOf(keyAccessor(obj3)).toEqualTypeOf<never>();
  });
});
