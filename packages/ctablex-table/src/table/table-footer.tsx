import { ReactElement, ReactNode } from 'react';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';

export interface TableFooterProps {
  el?: ReactElement;
  children?: ReactNode;
}

export function TableFooter(props: TableFooterProps) {
  const { children } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tfoot, { children });
  return el;
}
