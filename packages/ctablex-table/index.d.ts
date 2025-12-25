import { Accessor } from '@ctablex/core';
import { AccessorTo } from '@ctablex/core';
import { ContentValue } from '@ctablex/core';
import { ContentValueProps } from '@ctablex/core';
import { DefaultContent } from '@ctablex/core';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { JSXElementConstructor } from 'react';
import { NullableContent } from '@ctablex/core';
import { NullableContentProps } from '@ctablex/core';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

export declare function Cell<D>(props: CellProps<D>): JSX_2.Element;

export declare interface CellProps<D> {
  accessor?: Accessor<D>;
  children?: ReactNode;
  el?: ReactElement;
}

export declare function Column<D = any>(props: ColumnProps<D>): JSX_2.Element;

export declare interface ColumnProps<D = any> {
  children?: ReactNode;
  header?: ReactNode;
  accessor?: Accessor<D>;
  el?: ReactElement;
  thEl?: ReactElement;
}

export declare function Columns(props: ColumnsProps): JSX_2.Element;

export declare namespace Columns {
  var __COLUMNS__: boolean;
}

export declare interface ColumnsProps {
  part?: string;
  children?: ReactNode;
}

export { ContentValue };

export { ContentValueProps };

export declare function DataTable<D>(props: DataTableProps<D>): JSX_2.Element;

export declare interface DataTableProps<D> {
  data?: ReadonlyArray<D>;
  children: ReactNode;
}

export { DefaultContent };

export declare const defaultTableElements: TableElements;

export declare function HeaderCell(
  props: HeaderCellProps,
): ReactElement<any, string | JSXElementConstructor<any>>;

export declare interface HeaderCellProps {
  children?: ReactNode;
  el?: ReactElement;
}

export { NullableContent };

export { NullableContentProps };

export declare function Row<R>(props: RowProps<R>): JSX_2.Element;

export declare interface RowProps<R> {
  el?: ReactElement;
  children?: ReactNode;
  row?: R;
}

export declare function Rows<D>(props: RowsProps<D>): JSX_2.Element;

export declare interface RowsProps<D> {
  keyAccessor?: AccessorTo<D, string | number>;
  children?: ReactNode;
  rows?: ReadonlyArray<D>;
}

export declare function Table(
  props: TableProps,
): ReactElement<any, string | JSXElementConstructor<any>>;

export declare function TableBody(
  props: TableBodyProps,
): ReactElement<any, string | JSXElementConstructor<any>>;

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

export declare function TableFooter(
  props: TableFooterProps,
): ReactElement<any, string | JSXElementConstructor<any>>;

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
