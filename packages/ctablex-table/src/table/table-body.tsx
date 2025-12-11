import { ReactElement, ReactNode } from 'react';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';
import { Rows } from './rows';

const defaultChildren = <Rows />;

export interface TableBodyProps {
  el?: ReactElement;
  children?: ReactNode;
}

export function TableBody(props: TableBodyProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tbody, { children });
  return el;
}
