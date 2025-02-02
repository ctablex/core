import { JSX as JSX_2 } from 'react/jsx-runtime';
import { JSXElementConstructor } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

export declare type Accessor<D, C> =
  | StringAccessor<D, C>
  | FunctionAccessor<D, C>
  | null;

export declare function Column(props: ColumnProps): JSX_2.Element;

export declare interface ColumnProps {
  children?: ReactNode;
  header?: ReactNode;
  accessor?: Accessor<any, any>;
  el?: ReactElement;
  thEl?: ReactElement;
}

export declare function Columns(props: ColumnsProps): JSX_2.Element | null;

export declare namespace Columns {
  var __COLUMNS__: boolean;
}

export declare interface ColumnsProps {
  part?: string;
  children?: ReactNode;
}

export declare function ContentValue<D, C>(
  props: ContentValueProps<D, C>,
): JSX_2.Element;

declare interface ContentValueProps<D, C> {
  accessor: Accessor<D, C>;
  children?: ReactNode;
}

export declare function DataTable<D>(props: DataTableProps<D>): JSX_2.Element;

export declare interface DataTableProps<D> {
  data?: ReadonlyArray<D>;
  children: ReactNode;
}

export declare const defaultTableElements: TableElements;

declare type FunctionAccessor<D, C> = (data: D) => C;

export declare function getValue<D>(data: D, accessor: null): null;

export declare function getValue<D, C>(data: D, accessor: Accessor<D, C>): C;

export declare function getValue<D, C>(
  data: D,
  accessor: Accessor<D, C> | null,
): C | null;

export declare function Row<R>(props: RowProps<R>): JSX_2.Element;

export declare interface RowProps<R> {
  el?: ReactElement;
  children?: ReactNode;
  row?: R;
}

export declare function Rows<D>(props: RowsProps<D>): JSX_2.Element;

export declare interface RowsProps<D> {
  keyAccessor?: Accessor<D, string | number>;
  children?: ReactNode;
  rows?: ReadonlyArray<D>;
}

declare type StringAccessor<D, C> = {
  [K in keyof D]-?: D[K] extends C ? K : never;
}[keyof D];

export declare function Table(
  props: TableProps,
): ReactElement<any, string | JSXElementConstructor<any>>;

export declare function TableBody(props: TableBodyProps): JSX_2.Element;

export declare interface TableBodyProps {
  el?: ReactElement;
  children?: ReactNode;
}

export declare interface TableElements {
  table: ReactElement;
  thead: ReactElement;
  tbody: ReactElement;
  tfoot: ReactElement;
  tr: ReactElement;
  th: ReactElement;
  td: ReactElement;
}

export declare function TableElementsProvider(
  props: TableElementsProviderProps,
): JSX_2.Element;

declare interface TableElementsProviderProps {
  value: TableElements;
  children?: ReactNode;
}

export declare function TableFooter(props: TableFooterProps): JSX_2.Element;

export declare interface TableFooterProps {
  el?: ReactElement;
  children?: ReactNode;
}

export declare function TableHeader(props: TableHeaderProps): JSX_2.Element;

export declare interface TableHeaderProps {
  el?: ReactElement;
  children?: ReactNode;
}

export declare interface TableProps {
  el?: ReactElement;
  children?: ReactNode;
}

export declare function useTableElements(): TableElements;

export {};
