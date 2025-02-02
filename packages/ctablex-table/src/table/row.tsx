import { ContentProvider, useContent } from '@ctablex/core';
import { ReactElement, ReactNode } from 'react';
import { Columns } from '../columns/columns';
import { useTableElements } from '../elements/table-elements-context';
import { addProps } from '../utils/add-props';

const defaultChildren = <Columns />;

export interface RowProps<R> {
  el?: ReactElement;
  children?: ReactNode;
  row?: R;
}

export function Row<R>(props: RowProps<R>) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const row = useContent(props.row);
  const el = addProps(props.el ?? elements.tr, { children });
  return <ContentProvider value={row}>{el}</ContentProvider>;
}
