import { ReactNode, useMemo } from 'react';
import { DEFINITION_PART } from '../data-table';
import { usePart } from './part-context';
import { useColumns } from './columns-context';
import { findColumnsByPart } from './utils';

export interface ColumnsProps {
  part?: string;
  children?: ReactNode;
}

export function Columns(props: ColumnsProps) {
  const currentPart = usePart();
  const columns = useColumns();
  const { part } = props;

  const partColumns = useMemo(
    () => findColumnsByPart(columns, part),
    [columns, part],
  );
  if (currentPart === DEFINITION_PART) {
    return null;
  }
  return <>{partColumns}</>;
}

Columns.__COLUMNS__ = true;
