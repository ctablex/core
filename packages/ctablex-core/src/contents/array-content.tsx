import { ReactNode } from 'react';
import { accessByPathTo, PathAccessorTo } from '../accessor/path-accessor';
import { ContentProvider, useContent } from '../content-provider';
import { IndexContext } from '../contexts/index-context';
import { DefaultContent } from './default-content';

/**
 * Function type for extracting a unique key from array elements.
 */
export type ArrayGetKey<V> = (value: V, index: number) => string | number;

export interface ArrayContentProps<V> {
  /** Extracts unique key from each element (path or function). Defaults to index. */
  getKey?: PathAccessorTo<V, string | number> | ArrayGetKey<V>;
  /** Content to render for each element. Defaults to <DefaultContent />. */
  children?: ReactNode;
  /** Content to render between elements (e.g., commas, separators). */
  join?: ReactNode;
  /** Array to iterate. If omitted, uses context value. */
  value?: ReadonlyArray<V>;
}

const defaultChildren = <DefaultContent />;

/**
 * Iterates over an array, rendering children for each element.
 * Provides both the array element via ContentProvider and its index via IndexContext.
 *
 * Default children: <DefaultContent />
 */
export function ArrayContent<V>(props: ArrayContentProps<V>) {
  const {
    getKey: getKeyProps,
    children = defaultChildren,
    join = null,
  } = props;
  const content = useContent<ReadonlyArray<V>>(props.value);
  const getKey = (value: V, index: number) => {
    if (!getKeyProps) {
      return index;
    }
    if (typeof getKeyProps === 'function') {
      return getKeyProps(value, index);
    }
    return accessByPathTo(value, getKeyProps);
  };
  return (
    <>
      {content.map((value, index) => (
        <IndexContext.Provider value={index} key={getKey(value, index)}>
          <ContentProvider value={value}>
            {index > 0 && join}
            {children}
          </ContentProvider>
        </IndexContext.Provider>
      ))}
    </>
  );
}
