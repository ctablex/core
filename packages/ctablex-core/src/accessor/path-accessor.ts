export type PathAccessor<T> =
  T extends Array<any>
    ? never
    : T extends object
      ? {
          [K in keyof T]-?: `${Exclude<K, symbol>}${'' | `.${PathAccessor<T[K]>}`}`;
        }[keyof T]
      : never;

export type PathAccessorValue<T, K extends PathAccessor<T>> = 0 extends 1 & T
  ? any
  : T extends null | undefined
    ? PathAccessorValue<T & {}, K> | undefined
    : K extends keyof T
      ? T[K]
      : `${K}` extends `${infer Key extends keyof T & string}.${infer Rest}`
        ? Rest extends PathAccessor<T[Key]>
          ? PathAccessorValue<T[Key], Rest>
          : never
        : undefined;

export function accessByPath<T, P extends PathAccessor<T>>(
  obj: T,
  path: P,
): PathAccessorValue<T, P> {
  let keys = path.split('.');

  // @ts-ignore
  return keys.reduce((acc, key) => acc?.[key], obj);
}
