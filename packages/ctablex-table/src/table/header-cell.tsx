import { ReactElement, ReactNode } from 'react';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';

export interface HeaderCellProps {
  children?: ReactNode;
  el?: ReactElement;
}
export function HeaderCell(props: HeaderCellProps) {
  const contextEl = useTableElements();
  const { children } = props;
  return addProps(props.el ?? contextEl.th, { children });
}
