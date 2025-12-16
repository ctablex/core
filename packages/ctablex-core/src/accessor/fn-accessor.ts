/**
 * A function that extracts a value from an object.
 */
export type FnAccessor<T, R = any> = (t: T) => R;
/**
 * The return type of a function accessor.
 */
export type FnAccessorValue<T, F extends FnAccessor<T>> = F extends {
  (t: T, ...args: any[]): infer R;
  (t: T, ...args: any[]): any;
  (t: T, ...args: any[]): any;
  (t: T, ...args: any[]): any;
  (t: T, ...args: any[]): any;
}
  ? R
  : F extends {
        (t: T, ...args: any[]): any;
        (t: T, ...args: any[]): infer R;
        (t: T, ...args: any[]): any;
        (t: T, ...args: any[]): any;
        (t: T, ...args: any[]): any;
      }
    ? R
    : F extends {
          (t: T, ...args: any[]): any;
          (t: T, ...args: any[]): any;
          (t: T, ...args: any[]): infer R;
          (t: T, ...args: any[]): any;
          (t: T, ...args: any[]): any;
        }
      ? R
      : F extends {
            (t: T, ...args: any[]): any;
            (t: T, ...args: any[]): any;
            (t: T, ...args: any[]): any;
            (t: T, ...args: any[]): infer R;
            (t: T, ...args: any[]): any;
          }
        ? R
        : F extends {
              (t: T, ...args: any[]): any;
              (t: T, ...args: any[]): any;
              (t: T, ...args: any[]): any;
              (t: T, ...args: any[]): any;
              (t: T, ...args: any[]): infer R;
            }
          ? R
          : any;

/**
 * Accesses a value using a custom extraction function.
 * @param obj - The object to access
 * @param fn - Function that extracts the value
 * @returns The result of calling fn with obj
 */
export function accessByFn<T, F extends FnAccessor<T>>(
  obj: T,
  fn: F,
): FnAccessorValue<T, F> {
  return fn(obj);
}
