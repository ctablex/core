import { ReactNode } from 'react';
import { ContentProvider, useContent } from '../content-provider';
import { IndexContext } from '../contexts/index-context';
import { DefaultContent } from './default-content';

export interface ArrayContentProps<V> {
  getKey?: (value: V, index: number) => string | number;
  children?: ReactNode;
  join?: ReactNode;
}

const defaultGetKey = (value: any, index: number) => index;
const defaultChildren = <DefaultContent />;

export function ArrayContent<V>(props: ArrayContentProps<V>) {
  const {
    getKey = defaultGetKey,
    children = defaultChildren,
    join = null,
  } = props;
  const content = useContent<V[]>();
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
