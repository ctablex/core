export type KeyAccessor<T, R = any> =
  T extends Array<any>
    ? never
    : T extends object
      ? { [K in keyof T]-?: T[K] extends R ? K : never }[keyof T]
      : never;

export type KeyAccessorValue<
  T,
  R = any,
  K extends KeyAccessor<T, R> = KeyAccessor<T, R>,
> = R &
  (0 extends 1 & T
    ? any
    : T extends null | undefined
      ? KeyAccessorValue<T & {}, K> | undefined
      : K extends KeyAccessor<T>
        ? T[K]
        : undefined);

export function accessByKey<
  T,
  R,
  K extends KeyAccessor<T, R> = KeyAccessor<T, R>,
>(obj: T, key: K): KeyAccessorValue<T, R, K> {
  // @ts-ignore
  return obj?.[key];
}
