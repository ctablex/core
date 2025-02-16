import { ReactNode } from 'react';
import { accessByPathTo, PathAccessorTo } from '../accessor/path-accessor';
import { ContentProvider, useContent } from '../content-provider';
import { IndexContext } from '../contexts/index-context';
import { DefaultContent } from './default-content';

export type ArrayGetKey<V> = (value: V, index: number) => string | number;

export interface ArrayContentProps<V> {
  getKey?: PathAccessorTo<V, string | number> | ArrayGetKey<V>;
  children?: ReactNode;
  join?: ReactNode;
  value?: ReadonlyArray<V>;
}

const defaultChildren = <DefaultContent />;

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
