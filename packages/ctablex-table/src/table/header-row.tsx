import { ReactElement, ReactNode } from 'react';
import { Columns } from '../columns/columns';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';

const defaultChildren = <Columns />;

export interface TableProps {
  el?: ReactElement;
  children?: ReactNode;
}

export function HeaderRow(props: TableProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  return addProps(props.el ?? elements.tr, { children });
}
