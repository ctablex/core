import { createContext, ReactNode, useContext } from 'react';

export const IsHeaderContext = createContext<boolean>(false);

export function useIsHeader() {
  return useContext(IsHeaderContext);
}

export interface IsHeaderProviderProps {
  children?: ReactNode;
}

export function IsHeaderProvider(props: IsHeaderProviderProps) {
  return (
    <IsHeaderContext.Provider value={true}>
      {props.children}
    </IsHeaderContext.Provider>
  );
}
