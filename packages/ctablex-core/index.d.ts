import { Context } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ReactNode } from 'react';

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

export declare function IndexContent(props: IndexContentProps): JSX_2.Element;

export declare interface IndexContentProps {
  start?: number;
}

export declare const IndexContext: Context<number | undefined>;

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

export declare function useContent<V>(value?: V): V;

export declare function useIndex(): number;

export {};
