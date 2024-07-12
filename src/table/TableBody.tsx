import React, {
  ComponentProps,
  ComponentType,
  PropsWithChildren,
  ReactElement,
} from 'react';
import { ChildrenProvider } from '../children/ChildrenContext';
import { Rows } from '../row/Rows';
import { useTableElements } from '../TableElementsContext';
import { addProps } from '../utils/add-props';
import { TablePartProvider } from './TablePartContext';

interface TableBodyOwnProps<C extends ComponentType> {
  TbodyProps?: Partial<ComponentProps<C>>;
  tbodyEl?: ReactElement;
}

export type TableBodyProps<C extends ComponentType> = PropsWithChildren<
  TableBodyOwnProps<C>
>;
const defaultChildren = <Rows />;

export function TableBody<C extends ComponentType = ComponentType>(
  props: TableBodyProps<C>,
) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const element = addProps(props.tbodyEl ?? elements.tbody, props.TbodyProps, {
    el: 'tbodyEl',
    prop: 'TbodyProps',
  });
  return (
    <TablePartProvider value="body">
      <ChildrenProvider value={children}>{element}</ChildrenProvider>
    </TablePartProvider>
  );
}
