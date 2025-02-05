export type PathAccessor<T, R = any> =
  T extends Array<any>
    ? never
    : T extends object
      ? {
          [K in keyof T]-?: `${Exclude<K, symbol>}${
            | (T[K] extends R ? '' : never)
            | `.${undefined extends R
                ? PathAccessor<T[K], R>
                : undefined extends T[K]
                  ? never
                  : null extends T[K]
                    ? never
                    : PathAccessor<T[K], R>}`}`;
        }[keyof T]
      : never;

export type PathAccessorValue<
  T,
  R = any,
  K extends PathAccessor<T> = PathAccessor<T, R>,
> = R &
  (0 extends 1 & T
    ? any
    : T extends null | undefined
      ? PathAccessorValue<T & {}, R, K> | undefined
      : K extends keyof T
        ? T[K] extends R
          ? T[K]
          : never
        : `${K}` extends `${infer Key extends keyof T & string}.${infer Rest}`
          ? Rest extends PathAccessor<T[Key]>
            ? PathAccessorValue<T[Key], R, Rest>
            : never
          : undefined);

export function accessByPath<
  T,
  R,
  P extends PathAccessor<T, R> = PathAccessor<T, R>,
>(obj: T, path: P): PathAccessorValue<T, R, P> {
  let keys = path.split('.');

  // @ts-ignore
  return keys.reduce((acc, key) => acc?.[key], obj);
}
