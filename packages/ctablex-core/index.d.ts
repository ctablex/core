import { Context } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ReactNode } from 'react';

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
export declare function access<T, A extends Accessor<T>>(
  t: T,
  a: A,
): AccessorValue<T, A>;

/**
 * Accesses a value using a custom extraction function.
 * @param obj - The object to access
 * @param fn - Function that extracts the value
 * @returns The result of calling fn with obj
 */
export declare function accessByFn<T, F extends FnAccessor<T>>(
  obj: T,
  fn: F,
): FnAccessorValue<T, F>;

/**
 * Accesses a nested property using a dot-separated string path.
 * Provides full type safety with autocomplete and compile-time error detection.
 * @param t - The object to access
 * @param path - Dot-separated path like "user.address.city"
 * @returns The value at the specified path
 */
export declare function accessByPath<T, K extends PathAccessor<T>>(
  t: T,
  path: K,
): PathAccessorValue<T, K>;

/**
 * Accesses a nested property using a path constrained to return a specific type.
 * Like accessByPath but only accepts paths that return values of type R.
 * @param t - The object to access
 * @param path - Dot-separated path that returns type R
 * @returns The value at the specified path, typed as R
 */
export declare function accessByPathTo<
  R,
  T,
  K extends PathAccessorTo<T, R> = PathAccessorTo<T, R>,
>(t: T, path: K): R & PathAccessorValue<T, K>;

/**
 * Union type accepting path strings, functions, undefined, or null.
 */
export declare type Accessor<T> =
  | undefined
  | null
  | PathAccessor<T>
  | FnAccessor<T>;

export declare function AccessorContent<V>(
  props: AccessorContentProps<V>,
): JSX_2.Element;

export declare interface AccessorContentProps<V> {
  accessor: Accessor<V>;
  children?: ReactNode;
  value?: V;
}

/**
 * Union type accepting accessors constrained to return a specific type.
 */
export declare type AccessorTo<T, R = any> =
  | undefined
  | null
  | PathAccessorTo<T, R>
  | FnAccessor<T, R>;

/**
 * The type of the value returned by an accessor.
 */
export declare type AccessorValue<
  T,
  A extends Accessor<T>,
> = A extends undefined
  ? T
  : A extends null
    ? null
    : A extends PathAccessor<T>
      ? PathAccessorValue<T, A>
      : A extends FnAccessor<T>
        ? FnAccessorValue<T, A>
        : never;

/**
 * Accesses a value using an accessor constrained to return a specific type.
 * Like access but only accepts accessors that return values of type R.
 * @param t - The object to access
 * @param a - The accessor constrained to return type R
 * @returns The accessed value, typed as R
 */
export declare function accessTo<
  R,
  T,
  A extends AccessorTo<T, R> = AccessorTo<T, R>,
>(t: T, a: A): R & AccessorValue<T, A>;

declare type AllowedIndexes<
  Tuple extends ReadonlyArray<any>,
  Keys extends number = never,
> = Tuple extends readonly []
  ? Keys
  : Tuple extends readonly [infer _, ...infer Tail]
    ? AllowedIndexes<Tail, Keys | Tail['length']>
    : Keys;

export declare function ArrayContent<V>(
  props: ArrayContentProps<V>,
): JSX_2.Element;

export declare interface ArrayContentProps<V> {
  getKey?: PathAccessorTo<V, string | number> | ArrayGetKey<V>;
  children?: ReactNode;
  join?: ReactNode;
  value?: ReadonlyArray<V>;
}

declare type ArrayGetKey<V> = (value: V, index: number) => string | number;

declare type ComputeRange<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : ComputeRange<N, [...Result, Result['length']]>;

/**
 * The underlying React Context for the micro-context pattern.
 * @internal This is an internal API and may change in future versions.
 * Use `ContentProvider` and `useContent` instead.
 */
export declare const ContentContext: Context<
  ContentContextType<any> | undefined
>;

/**
 * The type of the content context value.
 * @internal This is an internal API and may change in future versions.
 */
export declare type ContentContextType<V> = {
  value: V;
};

/**
 * Provides a content context that can be retrieved with useContent.
 * Providers can be nested to create scoped contexts.
 */
export declare function ContentProvider<V>(
  props: ContentProviderProps<V>,
): JSX_2.Element;

/**
 * Props for ContentProvider.
 */
export declare interface ContentProviderProps<V> {
  /** The value to provide via context. */
  value: V;
  children?: ReactNode;
}

export declare function DefaultContent(): JSX_2.Element;

export declare function FieldContent<V>(
  props: FieldContentProps<V>,
): JSX_2.Element;

export declare interface FieldContentProps<V> {
  field: keyof V;
  children?: ReactNode;
}

/**
 * A function that extracts a value from an object.
 */
export declare type FnAccessor<T, R = any> = (t: T) => R;

/**
 * The return type of a function accessor.
 */
export declare type FnAccessorValue<T, F extends FnAccessor<T>> = F extends {
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

declare type Index40 = ComputeRange<40>[number];

export declare function IndexContent(props: IndexContentProps): JSX_2.Element;

export declare interface IndexContentProps {
  start?: number;
}

export declare const IndexContext: Context<number | undefined>;

declare type IsTuple<T> = T extends readonly any[] & {
  length: infer Length;
}
  ? Length extends Index40
    ? T
    : never
  : never;

export declare function KeyContent(): JSX_2.Element;

export declare function NullableContent(
  props: NullableContentProps,
): JSX_2.Element;

export declare interface NullableContentProps {
  children?: ReactNode;
  nullContent?: ReactNode;
}

export declare function ObjectContent<V extends object>(
  props: ObjectContentProps<V>,
): JSX_2.Element;

export declare interface ObjectContentProps<V extends object> {
  getKey?: ObjectGetKey<V>;
  children: ReactNode;
  join?: ReactNode;
  value?: V;
}

declare type ObjectGetKey<V extends object> = <K extends keyof V>(
  value: V[K],
  key: K,
  index: number,
) => string | number;

/**
 * String literal type representing valid dot-separated paths through an object.
 * Supports nested properties up to 5 levels deep.
 * @example "user.address.city"
 */
export declare type PathAccessor<
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

/**
 * String literal type representing paths through an object that return a specific type.
 * Filters PathAccessor<T> to only include paths where the value extends R.
 */
export declare type PathAccessorTo<T, R> = {
  [K in PathAccessor<T>]: PathAccessorValue<T, K> extends R ? K : never;
}[PathAccessor<T>] &
  string;

/**
 * The type of the value at a given path in an object.
 */
export declare type PathAccessorValue<T, TProp> = 0 extends 1 & T
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

declare type PathPrefix<
  T,
  TPrefix,
  TDepth extends any[],
> = TPrefix extends keyof T & (number | string)
  ? `${TPrefix}.${PathAccessor<T[TPrefix], [...TDepth, any]> & string}`
  : never;

/**
 * Retrieves the current value from the nearest ContentProvider.
 * @param value - Optional override value. If provided, returns this value instead of context.
 * @returns The content value from context or the override value.
 * @throws Error if called outside a ContentProvider and no override value is provided.
 */
export declare function useContent<V>(value?: V): V;

export declare function useIndex(): number;

export {};
