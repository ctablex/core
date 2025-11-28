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

/**
 * Iterates over an array, rendering children for each element.
 * Provides both the array element via ContentProvider and its index via IndexContext.
 *
 * Default children: <DefaultContent />
 */
export declare function ArrayContent<V>(
  props: ArrayContentProps<V>,
): JSX_2.Element;

export declare interface ArrayContentProps<V> {
  /** Extracts unique key from each element (path or function). Defaults to index. */
  getKey?: PathAccessorTo<V, string | number> | ArrayGetKey<V>;
  /** Content to render for each element. Defaults to <DefaultContent />. */
  children?: ReactNode;
  /** Content to render between elements (e.g., commas, separators). */
  join?: ReactNode;
  /** Array to iterate. If omitted, uses context value. */
  value?: ReadonlyArray<V>;
}

/**
 * Function type for extracting a unique key from array elements.
 */
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

/**
 * Transforms the content value using an accessor, then provides the result to children.
 * - Path string: Accesses nested properties like "user.address.city"
 * - Function: Calls the function with the content value
 * - undefined: Returns the content value unchanged
 * - null: Returns null
 *
 * Default children: <DefaultContent />
 */
declare function ContentValue<V>(props: ContentValueProps<V>): JSX_2.Element;
export { ContentValue as AccessorContent };
export { ContentValue };

declare interface ContentValueProps<V> {
  accessor: Accessor<V>;
  children?: ReactNode;
  value?: V;
}
export { ContentValueProps as AccessorContentProps };
export { ContentValueProps };

/**
 * Renders primitive values (string, number, null, undefined) directly from context.
 * Used as the default children for most content components.
 * Only works with primitives - objects and arrays of objects will cause React errors.
 */
export declare function DefaultContent(): JSX_2.Element;

export declare function EmptyContent<C>(
  props: EmptyContentProps<C>,
): JSX_2.Element | null;

export declare interface EmptyContentProps<C> {
  children?: ReactNode;
  isEmpty?: (content: C) => boolean;
}

/**
 * Accesses a single field of an object and provides its value to children.
 * Simplified version of AccessorContent for object properties.
 *
 * Default children: <DefaultContent />
 */
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

/**
 * Displays the current array or object iteration index from IndexContext.
 * Optionally adds a start offset to the index.
 */
export declare function IndexContent(props: IndexContentProps): JSX_2.Element;

export declare interface IndexContentProps {
  start?: number;
}

/**
 * Context providing the current array or object iteration index.
 * Used internally by ArrayContent and ObjectContent.
 */
export declare const IndexContext: Context<number | undefined>;

declare type IsTuple<T> = T extends readonly any[] & {
  length: infer Length;
}
  ? Length extends Index40
    ? T
    : never
  : never;

/**
 * Displays the current object property key from KeyContext.
 */
export declare function KeyContent(): JSX_2.Element;

/**
 * Context providing the current object property key during iteration.
 * Used internally by ObjectContent.
 */
export declare const KeyContext: Context<string | number | symbol | undefined>;

export declare function NonEmptyContent<C>(
  props: NonEmptyContentProps<C>,
): JSX_2.Element | null;

export declare interface NonEmptyContentProps<C> {
  children?: ReactNode;
  isEmpty?: (content: C) => boolean;
}

/**
 * Conditionally renders content based on whether the value is null or undefined.
 * Renders nullContent when value is null/undefined, otherwise renders children.
 *
 * Default children: <DefaultContent />
 */
export declare function NullableContent(
  props: NullableContentProps,
): JSX_2.Element;

export declare interface NullableContentProps {
  children?: ReactNode;
  nullContent?: ReactNode;
}

export declare function NullContent(
  props: NullContentProps,
): JSX_2.Element | null;

export declare interface NullContentProps {
  children?: ReactNode;
}

/**
 * Iterates over object properties, rendering children for each key-value pair.
 * Provides the property value via ContentProvider, key via KeyContext, and index via IndexContext.
 */
export declare function ObjectContent<V extends object>(
  props: ObjectContentProps<V>,
): JSX_2.Element;

export declare interface ObjectContentProps<V extends object> {
  /** Generates unique React key for each property. Defaults to property key. */
  getKey?: ObjectGetKey<V>;
  /** Content to render for each property. */
  children: ReactNode;
  /** Content to render between properties (e.g., commas, separators). */
  join?: ReactNode;
  /** Object to iterate. If omitted, uses context value. */
  value?: V;
}

/**
 * Function type for generating React keys from object properties.
 */
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

/**
 * Retrieves the current iteration index from ArrayContent or ObjectContent.
 * @returns The zero-based iteration index.
 * @throws Error if called outside an ArrayContent or ObjectContent.
 */
export declare function useIndex(): number;

/**
 * Retrieves the current object property key from ObjectContent.
 * @returns The property key (string, number, or symbol).
 * @throws Error if called outside an ObjectContent.
 */
export declare function useKey(): string | number | symbol;

export {};
