import { createContext, useContext } from 'react';

export const IndexContext = createContext<number | undefined>(undefined);

export function useIndex() {
  const context = useContext(IndexContext);
  if (context === undefined) {
    throw new Error('useIndex must be used within a IndexContext');
  }
  return context;
}
