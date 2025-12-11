import { ContentProvider, useContent } from '@ctablex/core';
import { ReactNode, useMemo } from 'react';
import { ColumnsProvider } from './columns/columns-context';
import { findColumns, findNonColumnsChildren } from './columns/utils';

export interface DataTableProps<D> {
  data?: ReadonlyArray<D>;
  children: ReactNode;
}
export function DataTable<D>(props: DataTableProps<D>) {
  const { children } = props;
  const data = useContent(props.data);
  const columns = useMemo(() => findColumns(children), [children]);
  const otherChildren = useMemo(
    () => findNonColumnsChildren(children),
    [children],
  );
  return (
    <ContentProvider value={data}>
      <ColumnsProvider value={columns}>{otherChildren}</ColumnsProvider>
    </ContentProvider>
  );
}
