import { createContext, useContext } from 'react';

export const KeyContext = createContext<string | number | symbol | undefined>(
  undefined,
);

export function useKey() {
  const context = useContext(KeyContext);
  if (context === undefined) {
    throw new Error('useKey must be used within a KeyContext');
  }
  return context;
}
