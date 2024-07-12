import { ComponentProps } from 'react';
import { ComponentType } from 'react';
import { Context } from 'react';
import { ElementType } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

export declare type Accessor<D, C> = string | ((row: D) => C);

export declare function ArrayOutput<V>(
  props: ArrayOutputProps<V>,
): JSX_2.Element;

declare interface ArrayOutputOwnProps<V> {
  value: ReadonlyArray<V>;
  getKey?: (value: V, index: number) => string | number;
}

export declare type ArrayOutputProps<V> = PropsWithChildren<
  ArrayOutputOwnProps<V>
>;

export declare function Cell<
  C extends ComponentType = ComponentType,
  A extends Accessor<any, any> = Accessor<any, any>,
>(props: CellProps<C, A>): JSX_2.Element;

declare interface CellOwnProps<
  C extends ComponentType,
  A extends Accessor<any, any>,
> {
  accessor: A | null;
  TdProps?: Partial<ComponentProps<C>>;
  tdEl?: ReactElement;
}

export declare type CellProps<
  C extends ComponentType,
  A extends Accessor<any, any>,
> = PropsWithChildren<CellOwnProps<C, A>>;

export declare function Children(props: ChildrenProps): JSX_2.Element;

declare type ChildrenContextType = ReactNode;

declare interface ChildrenOwnProps {}

declare type ChildrenProps = ChildrenOwnProps;

export declare function ChildrenProvider(
  props: ChildrenProviderProps,
): JSX_2.Element;

declare interface ChildrenProviderOwnProps {
  value: ChildrenContextType;
}

declare type ChildrenProviderProps =
  PropsWithChildren<ChildrenProviderOwnProps>;

export declare function Column<
  C extends ComponentType = ComponentType,
  H extends ComponentType = ComponentType,
  A extends Accessor<any, any> = Accessor<any, any>,
>(props: ColumnProps<C, H, A>): JSX_2.Element;

declare interface ColumnOwnProps<
  C extends ComponentType,
  H extends ComponentType,
  A extends Accessor<any, any>,
> {
  header?: ReactNode;
  accessor?: A | null;
  TdProps?: Partial<ComponentProps<C>>;
  ThProps?: Partial<ComponentProps<H>>;
  tdEl?: ReactElement;
  thEl?: ReactElement;
}

export declare type ColumnProps<
  C extends ComponentType,
  H extends ComponentType,
  A extends Accessor<any, any>,
> = PropsWithChildren<ColumnOwnProps<C, H, A>>;

export declare function Columns(props: ColumnsProps): JSX_2.Element | null;

export declare namespace Columns {
  var __COLUMNS__: boolean;
}

export declare const ColumnsContext: Context<ColumnsNode | undefined>;

export declare type ColumnsNode = ReactNode;

declare interface ColumnsOwnProps {
  part?: string;
}

export declare type ColumnsProps = PropsWithChildren<ColumnsOwnProps>;

export declare function ColumnsProvider(
  props: ColumnsProviderProps,
): JSX_2.Element;

declare interface ColumnsProviderOwnProps {
  value: ColumnsNode;
}

export declare type ColumnsProviderProps =
  PropsWithChildren<ColumnsProviderOwnProps>;

export declare interface ColumnsType {
  __COLUMNS__: true;
}

export declare type Content<V> = V;

export declare const ContentContext: Context<Content<any> | undefined>;

export declare function ContentProvider<V>(
  props: ContentProviderProps<V>,
): JSX_2.Element;

declare interface ContentProviderOwnProps<V> {
  value: Content<V>;
}

export declare type ContentProviderProps<V> = PropsWithChildren<
  ContentProviderOwnProps<V>
>;

export declare function ContentValue<D, C>(
  props: ContentValueProps<D, C>,
): JSX_2.Element;

declare interface ContentValueOwnProps<D, C> {
  accessor: Accessor<D, C> | null;
}

export declare type ContentValueProps<D, C> = PropsWithChildren<
  ContentValueOwnProps<D, C>
>;

export declare type CurrentValue<V> = V;

export declare const CurrentValueContext: Context<
  CurrentValue<any> | undefined
>;

export declare function CurrentValueProvider<V>(
  props: CurrentValueProviderProps<V>,
): JSX_2.Element;

export declare type CurrentValueProviderProps<V> = PropsWithChildren<
  ItemProviderOwnProps<V>
>;

export declare type Data<D> = ReadonlyArray<D>;

export declare const DataContext: Context<Data<any> | undefined>;

export declare function DataProvider<D>(
  props: DataProviderProps<D>,
): JSX_2.Element;

declare interface DataProviderOwnProps<D> {
  value: Data<D>;
}

export declare type DataProviderProps<D> = PropsWithChildren<
  DataProviderOwnProps<D>
>;

export declare function DataTable<D>(props: DataTableProps<D>): JSX_2.Element;

declare interface DataTableOwnProps<D> {
  data?: ReadonlyArray<D>;
}

export declare type DataTableProps<D> = PropsWithChildren<DataTableOwnProps<D>>;

export declare function DefaultContent(
  props: DefaultContentProps,
): JSX_2.Element;

declare interface DefaultContentOwnProps {}

export declare type DefaultContentProps =
  PropsWithChildren<DefaultContentOwnProps>;

export declare const defaultTableComponents: TableComponents;

export declare function findColumns(children: ReactNode): ReactNode;

export declare function getValue<D>(data: D, accessor: null): null;

export declare function getValue<D, C>(data: D, accessor: Accessor<D, C>): C;

export declare function getValue<D, C>(
  data: D,
  accessor: Accessor<D, C> | null,
): C | null;

export declare function HeaderCell<C extends ComponentType = ComponentType>(
  props: HeaderCellProps<C>,
): JSX_2.Element;

declare interface HeaderCellOwnProps<C extends ComponentType> {
  ThProps?: Partial<ComponentProps<C>>;
  thEl?: ReactElement;
}

export declare type HeaderCellProps<C extends ComponentType> =
  PropsWithChildren<HeaderCellOwnProps<C>>;

export declare function HeaderRow<C extends ComponentType = ComponentType>(
  props: HeaderRowProps<C>,
): JSX_2.Element;

declare interface HeaderRowOwnProps<C extends ComponentType> {
  TrProps?: Partial<ComponentProps<C>>;
  trEl?: ReactElement;
}

export declare type HeaderRowProps<C extends ComponentType> = PropsWithChildren<
  HeaderRowOwnProps<C>
>;

export declare type Index = number;

export declare const IndexContext: Context<Index | undefined>;

export declare function IndexProvider(props: IndexProviderProps): JSX_2.Element;

declare interface IndexProviderOwnProps {
  value: Index;
}

export declare type IndexProviderProps =
  PropsWithChildren<IndexProviderOwnProps>;

export declare function isColumnsType(type: any): type is ColumnsType;

declare interface ItemProviderOwnProps<V> {
  value: CurrentValue<V>;
}

export declare function Row<D, C extends ComponentType = ComponentType>(
  props: RowProps<D, C>,
): JSX_2.Element;

export declare type RowData<V> = V;

export declare const RowDataContext: Context<RowData<any> | undefined>;

export declare function RowDataProvider<V>(
  props: RowDataProviderProps<V>,
): JSX_2.Element;

declare interface RowDataProviderOwnProps<V> {
  value: RowData<V>;
}

export declare type RowDataProviderProps<V> = PropsWithChildren<
  RowDataProviderOwnProps<V>
>;

declare interface RowOwnProps<D, C extends ComponentType> {
  row?: D;
  TrProps?: Partial<ComponentProps<C>>;
  trEl?: ReactElement;
}

export declare type RowProps<D, C extends ComponentType> = PropsWithChildren<
  RowOwnProps<D, C>
>;

export declare function Rows<D>(props: RowsProps<D>): JSX_2.Element;

declare interface RowsOwnProps<D> {
  keyAccessor?: Accessor<D, string | number>;
  data?: ReadonlyArray<D>;
}

export declare type RowsProps<D> = PropsWithChildren<RowsOwnProps<D>>;

export declare function Table<C extends ComponentType = ComponentType>(
  props: TableProps<C>,
): JSX_2.Element;

export declare function TableBody<C extends ComponentType = ComponentType>(
  props: TableBodyProps<C>,
): JSX_2.Element;

declare interface TableBodyOwnProps<C extends ComponentType> {
  TbodyProps?: Partial<ComponentProps<C>>;
  tbodyEl?: ReactElement;
}

export declare type TableBodyProps<C extends ComponentType> = PropsWithChildren<
  TableBodyOwnProps<C>
>;

export declare interface TableComponents {
  Table: ElementType;
  Thead: ElementType;
  Tbody: ElementType;
  Tr: ElementType;
  Th: ElementType;
  Td: ElementType;
}

export declare const TableComponentsContext: Context<TableComponents>;

export declare function TableComponentsProvider(
  props: TableComponentsProviderProps,
): JSX_2.Element;

declare interface TableComponentsProviderOwnProps {
  value: TableComponents;
}

export declare type TableComponentsProviderProps =
  PropsWithChildren<TableComponentsProviderOwnProps>;

declare interface TableElements {
  table: ReactElement;
  thead: ReactElement;
  tbody: ReactElement;
  tr: ReactElement;
  th: ReactElement;
  td: ReactElement;
}

export declare const TableElementsContext: Context<TableElements>;

export declare function TableElementsProvider(
  props: TableElementsProviderProps,
): JSX_2.Element;

declare interface TableElementsProviderOwnProps {
  value: TableElements;
}

declare type TableElementsProviderProps =
  PropsWithChildren<TableElementsProviderOwnProps>;

export declare function TableHeader<C extends ComponentType = ComponentType>(
  props: TableHeaderProps<C>,
): JSX_2.Element;

declare interface TableHeaderOwnProps<C extends ComponentType> {
  TheadProps?: Partial<ComponentProps<C>>;
  theadEl?: ReactElement;
}

export declare type TableHeaderProps<C extends ComponentType> =
  PropsWithChildren<TableHeaderOwnProps<C>>;

declare interface TableOwnProps<C extends ComponentType> {
  TableProps?: Partial<ComponentProps<C>>;
  tableEl?: ReactElement;
}

export declare type TablePart = TablePartType;

export declare const TablePartContext: Context<TablePart | undefined>;

export declare function TablePartProvider(
  props: TablePartProviderProps,
): JSX_2.Element;

declare interface TablePartProviderOwnProps {
  value: TablePart;
}

export declare type TablePartProviderProps =
  PropsWithChildren<TablePartProviderOwnProps>;

export declare type TablePartType = 'definition' | 'header' | 'body';

export declare type TableProps<C extends ComponentType> = PropsWithChildren<
  TableOwnProps<C>
>;

export declare function useChildren(): ChildrenContextType;

export declare function UseColumns(props: UseColumnsProps): JSX_2.Element;

export declare function useColumns(): ColumnsNode;

declare interface UseColumnsOwnProps {
  part?: string;
}

export declare type UseColumnsProps = PropsWithChildren<UseColumnsOwnProps>;

export declare function useContent<V>(): Content<V>;

export declare function useContentValue(accessor: null): null;

export declare function useContentValue<D, C>(accessor: Accessor<D, C>): C;

export declare function useContentValue<D, C>(
  accessor: Accessor<D, C> | null,
): C | null;

export declare function useCurrentValue<V>(value?: V): CurrentValue<V>;

export declare function useData<D>(value?: ReadonlyArray<D>): Data<D>;

export declare function useIndex(): Index;

export declare function useRowData<V>(): RowData<V>;

export declare function useTableComponents(): TableComponents;

export declare function useTableElements(): TableElements;

export declare function useTablePart(): TablePart;

export declare function withDefaultChildren<
  TProps extends {
    children?: ReactNode;
  },
  C extends ComponentType<TProps> | keyof JSX.IntrinsicElements,
>(Cmp: C): ComponentType<ComponentProps<C>>;

export {};
