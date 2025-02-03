export type KeyAccessor<T> =
  T extends Array<any>
    ? never
    : T extends object
      ? { [K in keyof T]-?: K }[keyof T]
      : never;

export type KeyAccessorValue<T, K extends KeyAccessor<T>> = 0 extends 1 & T
  ? any
  : T extends null | undefined
    ? KeyAccessorValue<T & {}, K> | undefined
    : K extends keyof T
      ? T[K]
      : undefined;

export function accessByKey<T, K extends KeyAccessor<T>>(
  obj: T,
  key: K,
): KeyAccessorValue<T, K> {
  // @ts-ignore
  return obj?.[key];
}
