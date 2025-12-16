// source: https://github.com/TanStack/table/blob/827b09814c659a5d196e63c7b827858db243a9cd/packages/table-core/src/utils.ts#L46C13-L46C18

type ComputeRange<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : ComputeRange<N, [...Result, Result['length']]>;
type Index40 = ComputeRange<40>[number];
type IsTuple<T> = T extends readonly any[] & {
  length: infer Length;
}
  ? Length extends Index40
    ? T
    : never
  : never;
type AllowedIndexes<
  Tuple extends ReadonlyArray<any>,
  Keys extends number = never,
> = Tuple extends readonly []
  ? Keys
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Tuple extends readonly [infer _, ...infer Tail]
    ? AllowedIndexes<Tail, Keys | Tail['length']>
    : Keys;
/**
 * String literal type representing valid dot-separated paths through an object.
 * Supports nested properties up to 5 levels deep.
 * @example "user.address.city"
 */
export type PathAccessor<
  T,
  TDepth extends any[] = [],
> = (TDepth['length'] extends 5
  ? never
  : unknown extends T
    ? string
    : T extends readonly any[] & IsTuple<T>
      ? AllowedIndexes<T> | PathPrefix<T, AllowedIndexes<T>, TDepth>
      : T extends any[]
        ? PathAccessor<T[number], [...TDepth, any]>
        : T extends Date
          ? never
          : T extends object
            ? (keyof T & string) | PathPrefix<T, keyof T, TDepth>
            : never) &
  string;

type PathPrefix<T, TPrefix, TDepth extends any[]> = TPrefix extends keyof T &
  (number | string)
  ? `${TPrefix}.${PathAccessor<T[TPrefix], [...TDepth, any]> & string}`
  : never;

/**
 * The type of the value at a given path in an object.
 */
export type PathAccessorValue<T, TProp> = 0 extends 1 & T
  ? any
  : T extends null | undefined
    ? PathAccessorValue<T & {}, TProp> | undefined
    : T extends Record<string | number, any>
      ? TProp extends `${infer TBranch}.${infer TDeepProp}`
        ? PathAccessorValue<T[TBranch], TDeepProp>
        : TProp extends keyof T
          ? T[TProp & string]
          : undefined
      : never;

/**
 * String literal type representing paths through an object that return a specific type.
 * Filters PathAccessor<T> to only include paths where the value extends R.
 */
export type PathAccessorTo<T, R> = {
  [K in PathAccessor<T>]: PathAccessorValue<T, K> extends R ? K : never;
}[PathAccessor<T>] &
  string;

/**
 * Accesses a nested property using a dot-separated string path.
 * Provides full type safety with autocomplete and compile-time error detection.
 * @param t - The object to access
 * @param path - Dot-separated path like "user.address.city"
 * @returns The value at the specified path
 */
export function accessByPath<T, K extends PathAccessor<T>>(
  t: T,
  path: K,
): PathAccessorValue<T, K> {
  // @ts-ignore
  return path.split('.').reduce((acc, key) => acc?.[key], t);
}

/**
 * Accesses a nested property using a path constrained to return a specific type.
 * Like accessByPath but only accepts paths that return values of type R.
 * @param t - The object to access
 * @param path - Dot-separated path that returns type R
 * @returns The value at the specified path, typed as R
 */
export function accessByPathTo<
  R,
  T,
  K extends PathAccessorTo<T, R> = PathAccessorTo<T, R>,
>(t: T, path: K): R & PathAccessorValue<T, K> {
  // @ts-ignore
  return accessByPath(t, path);
}
