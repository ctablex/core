import { createContext, ReactNode, useContext } from 'react';

export const PartContext = createContext<string | undefined>(undefined);

export function usePart() {
  const context = useContext(PartContext);
  if (!context) {
    throw new Error('usePart must be used within a PartContext');
  }
  return context;
}

export interface PartProviderProps {
  value: string;
  children?: ReactNode;
}

export function PartProvider(props: PartProviderProps) {
  return (
    <PartContext.Provider value={props.value}>
      {props.children}
    </PartContext.Provider>
  );
}
