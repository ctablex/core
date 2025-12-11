import { ReactElement, ReactNode } from 'react';
import { IsHeaderProvider } from '../columns/is-header-context';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';
import { HeaderRow } from './header-row';

const defaultChildren = <HeaderRow />;

export interface TableHeaderProps {
  el?: ReactElement;
  children?: ReactNode;
}

export function TableHeader(props: TableHeaderProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.thead, { children });
  return <IsHeaderProvider>{el}</IsHeaderProvider>;
}
