import { Accessor, DefaultContent } from '@ctablex/core';
import { ReactElement, ReactNode } from 'react';
import { Cell } from '../table/cell';
import { HeaderCell } from '../table/header-cell';
import { HEADER_PART } from '../table/table-header';
import { usePart } from './part-context';

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
  const part = usePart();
  if (part === HEADER_PART) {
    return <HeaderCell el={props.thEl}>{props.header}</HeaderCell>;
  }
  return (
    <Cell accessor={props.accessor} el={props.el}>
      {children}
    </Cell>
  );
}
