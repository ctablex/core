import { describe, expect, expectTypeOf, it } from 'vitest';
import { access } from './accessor';

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
});
