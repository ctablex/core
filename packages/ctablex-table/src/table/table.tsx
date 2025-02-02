import { ReactElement, ReactNode } from 'react';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';
import { TableBody } from './table-body';
import { TableHeader } from './table-header';

const defaultChildren = (
  <>
    <TableHeader />
    <TableBody />
  </>
);

export interface TableProps {
  el?: ReactElement;
  children?: ReactNode;
}

export function Table(props: TableProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  return addProps(props.el ?? elements.table, { children });
}
