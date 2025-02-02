import { ContentProvider, useContent } from '@ctablex/core';
import { ReactNode, useMemo } from 'react';
import { ColumnsProvider } from './columns/columns-context';
import { findColumns } from './columns/utils';
import { PartProvider } from './columns/part-context';

export const DEFINITION_PART = '__DEFINITION__';
export interface DataTableProps<D> {
  data?: ReadonlyArray<D>;
  children: ReactNode;
}
export function DataTable<D>(props: DataTableProps<D>) {
  const { children } = props;
  const data = useContent(props.data);
  const columns = useMemo(() => findColumns(children), [children]);
  return (
    <ContentProvider value={data}>
      <PartProvider value={DEFINITION_PART}>
        <ColumnsProvider value={columns}>{children}</ColumnsProvider>
      </PartProvider>
    </ContentProvider>
  );
}
