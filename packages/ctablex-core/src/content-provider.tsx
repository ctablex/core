import { ReactNode, useContext, useMemo } from 'react';
import { ContentContext } from './contexts/content-context';

/**
 * Retrieves the current value from the nearest ContentProvider.
 * @param value - Optional override value. If provided, returns this value instead of context.
 * @returns The content value from context or the override value.
 * @throws Error if called outside a ContentProvider and no override value is provided.
 */
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

/**
 * Props for ContentProvider.
 */
export interface ContentProviderProps<V> {
  /** The value to provide via context. */
  value: V;
  children?: ReactNode;
}

/**
 * Provides a content context that can be retrieved with useContent.
 * Providers can be nested to create scoped contexts.
 */
export function ContentProvider<V>(props: ContentProviderProps<V>) {
  const context = useMemo(() => ({ value: props.value }), [props.value]);
  return (
    <ContentContext.Provider value={context}>
      {props.children}
    </ContentContext.Provider>
  );
}
