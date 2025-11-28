import { createContext, useContext } from 'react';

/**
 * Context providing the current array or object iteration index.
 * Used internally by ArrayContent and ObjectContent.
 */
export const IndexContext = createContext<number | undefined>(undefined);

/**
 * Retrieves the current iteration index from ArrayContent or ObjectContent.
 * @returns The zero-based iteration index.
 * @throws Error if called outside an ArrayContent or ObjectContent.
 */
export function useIndex() {
  const context = useContext(IndexContext);
  if (context === undefined) {
    throw new Error('useIndex must be used within a IndexContext');
  }
  return context;
}
