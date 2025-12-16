import { FnAccessor, FnAccessorValue } from './fn-accessor';
import {
  accessByPath,
  PathAccessor,
  PathAccessorTo,
  PathAccessorValue,
} from './path-accessor';

/**
 * Union type accepting path strings, functions, undefined, or null.
 */
export type Accessor<T> = undefined | null | PathAccessor<T> | FnAccessor<T>;
/**
 * Union type accepting accessors constrained to return a specific type.
 */
export type AccessorTo<T, R = any> =
  | undefined
  | null
  | PathAccessorTo<T, R>
  | FnAccessor<T, R>;
/**
 * The type of the value returned by an accessor.
 */
export type AccessorValue<T, A extends Accessor<T>> = A extends undefined
  ? T
  : A extends null
    ? null
    : A extends PathAccessor<T>
      ? PathAccessorValue<T, A>
      : A extends FnAccessor<T>
        ? FnAccessorValue<T, A>
        : never;

/**
 * Accesses a value using a path string, function, undefined, or null.
 * - undefined returns the input unchanged
 * - null returns null
 * - string uses accessByPath
 * - function calls the function with the input
 * @param t - The object to access
 * @param a - The accessor (path, function, undefined, or null)
 * @returns The accessed value
 */
export function access<T, A extends Accessor<T>>(
  t: T,
  a: A,
): AccessorValue<T, A> {
  if (a === undefined) {
    // @ts-ignore
    return t;
  }
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

/**
 * Accesses a value using an accessor constrained to return a specific type.
 * Like access but only accepts accessors that return values of type R.
 * @param t - The object to access
 * @param a - The accessor constrained to return type R
 * @returns The accessed value, typed as R
 */
export function accessTo<R, T, A extends AccessorTo<T, R> = AccessorTo<T, R>>(
  t: T,
  a: A,
): R & AccessorValue<T, A> {
  // @ts-ignore
  return access(t, a);
}
