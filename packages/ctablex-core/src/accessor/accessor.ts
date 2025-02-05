import { FnAccessor, FnAccessorValue } from './fn-accessor';
import { accessByPath, PathAccessor, PathAccessorValue } from './path-accessor';

export type Accessor<T, R = any> = null | PathAccessor<T> | FnAccessor<T, R>;
export type AccessorValue<T, A extends Accessor<T>> = A extends null
  ? null
  : A extends PathAccessor<T>
    ? PathAccessorValue<T, A>
    : A extends FnAccessor<T>
      ? FnAccessorValue<T, A>
      : never;

export function access<T, A extends Accessor<T>>(
  t: T,
  a: A,
): AccessorValue<T, A> {
  if (a === null) {
    // @ts-ignore
    return null;
  }
  if (typeof a === 'string') {
    // @ts-ignore
    return accessByPath(t, a);
  }
  return a(t);
}
