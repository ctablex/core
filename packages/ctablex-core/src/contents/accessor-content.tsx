import { ReactNode } from 'react';
import { access, Accessor } from '../accessor/accessor';
import { ContentProvider, useContent } from '../content-provider';
import { DefaultContent } from './default-content';

export interface AccessorContentProps<V> {
  accessor: Accessor<V>;
  children?: ReactNode;
}

const defaultChildren = <DefaultContent />;
export function AccessorContent<V>(props: AccessorContentProps<V>) {
  const { accessor, children = defaultChildren } = props;
  const content = useContent<V>();
  return (
    <ContentProvider value={access(content, accessor)}>
      {children}
    </ContentProvider>
  );
}
