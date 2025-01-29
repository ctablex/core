import { ReactNode, useContext, useMemo } from 'react';
import { ContentContext } from './contexts/content-context';

export function useContent<V>(value?: V) {
  const context = useContext(ContentContext);
  if (value !== undefined) {
    return value;
  }
  if (!context) {
    throw new Error('useContent must be used within a ContentContext');
  }
  return context.value as V;
}

export interface ContentProviderProps<V> {
  value: V;
  children?: ReactNode;
}
export function ContentProvider<V>(props: ContentProviderProps<V>) {
  const context = useMemo(() => ({ value: props.value }), [props.value]);
  return (
    <ContentContext.Provider value={context}>
      {props.children}
    </ContentContext.Provider>
  );
}
