import { ReactElement, ReactNode } from 'react';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';

export interface CellProps {
  children?: ReactNode;
  el?: ReactElement;
}
export function HeaderCell(props: CellProps) {
  const contextEl = useTableElements();
  const { children } = props;
  return addProps(props.el ?? contextEl.th, { children });
}
