import { createContext, useContext } from 'react';

/**
 * Context providing the current object property key during iteration.
 * Used internally by ObjectContent.
 */
export const KeyContext = createContext<string | number | symbol | undefined>(
  undefined,
);

/**
 * Retrieves the current object property key from ObjectContent.
 * @returns The property key (string, number, or symbol).
 * @throws Error if called outside an ObjectContent.
 */
export function useKey() {
  const context = useContext(KeyContext);
  if (context === undefined) {
    throw new Error('useKey must be used within a KeyContext');
  }
  return context;
}
