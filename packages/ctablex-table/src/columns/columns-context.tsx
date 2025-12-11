import { createContext, ReactNode, useContext } from 'react';

export const ColumnsContext = createContext<ReactNode>(undefined);

export function useColumns() {
  return useContext(ColumnsContext);
}

export interface ColumnsProviderProps {
  value: ReactNode;
  children?: ReactNode;
}

export function ColumnsProvider(props: ColumnsProviderProps) {
  return (
    <ColumnsContext.Provider value={props.value}>
      {props.children}
    </ColumnsContext.Provider>
  );
}
