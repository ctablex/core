import { Context } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ReactNode } from 'react';

export declare function access<T, A extends Accessor<T>>(
  t: T,
  a: A,
): AccessorValue<T, A>;

export declare function accessByFn<T, F extends FnAccessor<T>>(
  obj: T,
  fn: F,
): FnAccessorValue<T, F>;

export declare function accessByPath<T, K extends PathAccessor<T>>(
  t: T,
  path: K,
): PathAccessorValue<T, K>;

export declare function accessByPathTo<
  R,
  T,
  K extends PathAccessorTo<T, R> = PathAccessorTo<T, R>,
>(t: T, path: K): R & PathAccessorValue<T, K>;

export declare type Accessor<T> = null | PathAccessor<T> | FnAccessor<T>;

export declare function AccessorContent<V>(
  props: AccessorContentProps<V>,
): JSX_2.Element;

export declare interface AccessorContentProps<V> {
  accessor: Accessor<V>;
  children?: ReactNode;
}

export declare type AccessorTo<T, R = any> =
  | null
  | PathAccessorTo<T, R>
  | FnAccessor<T, R>;

export declare type AccessorValue<T, A extends Accessor<T>> = A extends null
  ? null
  : A extends PathAccessor<T>
    ? PathAccessorValue<T, A>
    : A extends FnAccessor<T>
      ? FnAccessorValue<T, A>
      : never;

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
  getKey?: (value: V, index: number) => string | number;
  children?: ReactNode;
  join?: ReactNode;
}

declare type ComputeRange<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : ComputeRange<N, [...Result, Result['length']]>;

export declare const ContentContext: Context<
  ContentContextType<any> | undefined
>;

export declare type ContentContextType<V> = {
  value: V;
};

export declare function ContentProvider<V>(
  props: ContentProviderProps<V>,
): JSX_2.Element;

export declare interface ContentProviderProps<V> {
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

export declare type FnAccessor<T, R = any> = (t: T) => R;

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
}

declare type ObjectGetKey<V extends object> = <K extends keyof V>(
  value: V[K],
  key: K,
  index: number,
) => string | number;

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

export declare type PathAccessorTo<T, R> = {
  [K in PathAccessor<T>]: PathAccessorValue<T, K> extends R ? K : never;
}[PathAccessor<T>] &
  string;

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

export declare function useContent<V>(value?: V): V;

export declare function useIndex(): number;

export {};
