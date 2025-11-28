import { createContext } from 'react';

/**
 * The type of the content context value.
 * @internal This is an internal API and may change in future versions.
 */
export type ContentContextType<V> = { value: V };

/**
 * The underlying React Context for the micro-context pattern.
 * @internal This is an internal API and may change in future versions.
 * Use `ContentProvider` and `useContent` instead.
 */
export const ContentContext = createContext<
  ContentContextType<any> | undefined
>(undefined);
