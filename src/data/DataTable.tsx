import React, { PropsWithChildren } from 'react';
import { ColumnsContextProvider } from '../column/ColumnsContext';
import { findColumns } from '../column/findColumns';
import { TablePartContextProvider } from '../table/TablePartContext';
import { DataContextProvider, useData } from './DataContext';

interface DataTableOwnProps<D> {
  data?: ReadonlyArray<D>;
}

export type DataTableProps<D> = PropsWithChildren<DataTableOwnProps<D>>;

export function DataTable<D>(props: DataTableProps<D>) {
  const { children } = props;
  const columns = findColumns(children);
  const data = useData<D>(props.data);
  return (
    <DataContextProvider value={data}>
      <TablePartContextProvider value="definition">
        <ColumnsContextProvider value={columns}>
          {children}
        </ColumnsContextProvider>
      </TablePartContextProvider>
    </DataContextProvider>
  );
}
