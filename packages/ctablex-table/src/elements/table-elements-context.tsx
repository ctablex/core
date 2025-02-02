import { createContext, ReactNode, useContext } from 'react';
import { defaultTableElements, TableElements } from './table-elements';

export const TableElementsContext = createContext<TableElements | undefined>(
  undefined,
);

export function useTableElements() {
  const context = useContext(TableElementsContext);
  return context ?? defaultTableElements;
}

export interface TableElementsProviderProps {
  value: TableElements;
  children?: ReactNode;
}

export function TableElementsProvider(props: TableElementsProviderProps) {
  return (
    <TableElementsContext.Provider value={props.value}>
      {props.children}
    </TableElementsContext.Provider>
  );
}
