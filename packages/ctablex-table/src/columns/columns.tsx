import { ReactNode, useMemo } from 'react';
import { useColumns } from './columns-context';
import { findColumnsByPart } from './utils';

export interface ColumnsProps {
  part?: string;
  children?: ReactNode;
}

export function Columns(props: ColumnsProps) {
  const columns = useColumns();
  if (columns === undefined) {
    throw new Error('Columns must be used within a DataTable');
  }
  const { part } = props;

  const partColumns = useMemo(
    () => findColumnsByPart(columns, part),
    [columns, part],
  );
  return <>{partColumns}</>;
}

Columns.__COLUMNS__ = true;
