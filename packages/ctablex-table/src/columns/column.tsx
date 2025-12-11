import { Accessor, DefaultContent } from '@ctablex/core';
import { ReactElement, ReactNode } from 'react';
import { Cell } from '../table/cell';
import { HeaderCell } from '../table/header-cell';
import { useIsHeader } from './is-header-context';

export interface ColumnProps<D = any> {
  children?: ReactNode;
  header?: ReactNode;
  accessor?: Accessor<D>;
  el?: ReactElement;
  thEl?: ReactElement;
}

const defaultChildren = <DefaultContent />;

export function Column<D = any>(props: ColumnProps<D>) {
  const { children = defaultChildren } = props;
  const isHeader = useIsHeader();
  if (isHeader) {
    return <HeaderCell el={props.thEl}>{props.header}</HeaderCell>;
  }
  return (
    <Cell accessor={props.accessor} el={props.el}>
      {children}
    </Cell>
  );
}
