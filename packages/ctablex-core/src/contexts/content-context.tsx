import { createContext } from 'react';

export type ContentContextType<V> = { value: V };
export const ContentContext = createContext<
  ContentContextType<any> | undefined
>(undefined);
