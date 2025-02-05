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

export declare function accessByKey<T, K extends KeyAccessor<T>>(
  obj: T,
  key: K,
): KeyAccessorValue<T, K>;

export declare function accessByPath<T, P extends PathAccessor<T>>(
  obj: T,
  path: P,
): PathAccessorValue<T, P>;

export declare type Accessor<T, R = any> =
  | null
  | PathAccessor<T>
  | FnAccessor<T, R>;

export declare type AccessorValue<T, A extends Accessor<T>> = A extends null
  ? null
  : A extends PathAccessor<T>
    ? PathAccessorValue<T, A>
    : A extends FnAccessor<T>
      ? FnAccessorValue<T, A>
      : never;

export declare function ArrayContent<V>(
  props: ArrayContentProps<V>,
): JSX_2.Element;

export declare interface ArrayContentProps<V> {
  getKey?: (value: V, index: number) => string | number;
  children?: ReactNode;
  join?: ReactNode;
}

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

export declare function IndexContent(props: IndexContentProps): JSX_2.Element;

export declare interface IndexContentProps {
  start?: number;
}

export declare const IndexContext: Context<number | undefined>;

export declare type KeyAccessor<T> =
  T extends Array<any>
    ? never
    : T extends object
      ? {
          [K in keyof T]-?: K;
        }[keyof T]
      : never;

export declare type KeyAccessorValue<
  T,
  K extends KeyAccessor<T>,
> = 0 extends 1 & T
  ? any
  : T extends null | undefined
    ? KeyAccessorValue<T & {}, K> | undefined
    : K extends keyof T
      ? T[K]
      : undefined;

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

export declare type PathAccessor<T> =
  T extends Array<any>
    ? never
    : T extends object
      ? {
          [K in keyof T]-?: `${Exclude<K, symbol>}${'' | `.${PathAccessor<T[K]>}`}`;
        }[keyof T]
      : never;

export declare type PathAccessorValue<
  T,
  K extends PathAccessor<T>,
> = 0 extends 1 & T
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

export declare function useContent<V>(value?: V): V;

export declare function useIndex(): number;

export {};
