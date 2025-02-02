import { ContentProvider, useContent } from '@ctablex/core';
import { ReactElement, ReactNode } from 'react';
import { getValue, Accessor } from '../accessor';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';

export interface CellProps<D, C> {
  accessor?: Accessor<D, C> | null;
  children?: ReactNode;
  el?: ReactElement;
}
export function Cell<D, C>(props: CellProps<D, C>) {
  const content = useContent<D>();
  const contextEl = useTableElements();
  const { accessor, children } = props;
  const el = addProps(props.el ?? contextEl.td, { children });
  if (accessor === undefined) {
    return el;
  }
  const value = getValue(content, accessor);
  return <ContentProvider value={value}>{el}</ContentProvider>;
}
