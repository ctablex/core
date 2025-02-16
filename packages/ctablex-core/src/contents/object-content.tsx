import { ReactNode } from 'react';
import { ContentProvider, useContent } from '../content-provider';
import { IndexContext } from '../contexts/index-context';
import { KeyContext } from '../contexts/key-context';

export type ObjectGetKey<V extends object> = <K extends keyof V>(
  value: V[K],
  key: K,
  index: number,
) => string | number;

export interface ObjectContentProps<V extends object> {
  getKey?: ObjectGetKey<V>;
  children: ReactNode;
  join?: ReactNode;
  value?: V;
}

const defaultGetKey: ObjectGetKey<any> = (value, key, index) => key.toString();

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
