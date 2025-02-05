import { FnAccessor, FnAccessorValue } from './fn-accessor';
import { accessByPath, PathAccessor, PathAccessorValue } from './path-accessor';

export type Accessor<T, R = any> = null extends R
  ? null | PathAccessor<T, R> | FnAccessor<T, R>
  : PathAccessor<T, R> | FnAccessor<T, R>;

export type AccessorValue<
  T,
  R = any,
  A extends Accessor<T, R> = Accessor<T, R>,
> = R & (A extends null
  ? null
  : A extends PathAccessor<T, R>
    ? PathAccessorValue<T, R, A>
    : A extends FnAccessor<T, R>
      ? FnAccessorValue<T, A>
      : never);

export function access<T, R, A extends Accessor<T, R> = Accessor<T, R>>(
  t: T,
  a: A,
): AccessorValue<T, R, A> {
  if (a === null) {
    // @ts-ignore
    return null;
  }
  if (typeof a === 'string') {
    // @ts-ignore
    return accessByPath(t, a);
  }
  // @ts-ignore
  return a(t);
}
