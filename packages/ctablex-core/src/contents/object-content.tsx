import { ReactNode } from 'react';
import { ContentProvider, useContent } from '../content-provider';
import { IndexContext } from '../contexts/index-context';
import { KeyContext } from '../contexts/key-context';

/**
 * Function type for generating React keys from object properties.
 */
export type ObjectGetKey<V extends object> = <K extends keyof V>(
  value: V[K],
  key: K,
  index: number,
) => string | number;

export interface ObjectContentProps<V extends object> {
  /** Generates unique React key for each property. Defaults to property key. */
  getKey?: ObjectGetKey<V>;
  /** Content to render for each property. */
  children: ReactNode;
  /** Content to render between properties (e.g., commas, separators). */
  join?: ReactNode;
  /** Object to iterate. If omitted, uses context value. */
  value?: V;
}

const defaultGetKey: ObjectGetKey<any> = (value, key, index) => key.toString();

/**
 * Iterates over object properties, rendering children for each key-value pair.
 * Provides the property value via ContentProvider, key via KeyContext, and index via IndexContext.
 */
export function ObjectContent<V extends object>(props: ObjectContentProps<V>) {
  const { getKey = defaultGetKey, children, join = null } = props;
  const content = useContent<V>(props.value);
  const keys = Object.keys(content) as Array<keyof V>;
  return (
    <>
      {keys.map((key, index) => (
        <IndexContext.Provider
          value={index}
          key={getKey(content[key], key, index)}
        >
          <KeyContext.Provider value={key}>
            <ContentProvider value={content[key]}>
              {index > 0 && join}
              {children}
            </ContentProvider>
          </KeyContext.Provider>
        </IndexContext.Provider>
      ))}
    </>
  );
}
