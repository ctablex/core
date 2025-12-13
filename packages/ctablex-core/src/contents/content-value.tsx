import { ReactNode } from 'react';
import { access, Accessor } from '../accessor/accessor';
import { ContentProvider, useContent } from '../content-provider';
import { DefaultContent } from './default-content';

export interface ContentValueProps<V> {
  accessor: Accessor<V>;
  children?: ReactNode;
  value?: V;
}

const defaultChildren = <DefaultContent />;
export function ContentValue<V>(props: ContentValueProps<V>) {
  const { accessor, children = defaultChildren } = props;
  const content = useContent<V>(props.value);
  return (
    <ContentProvider value={access(content, accessor)}>
      {children}
    </ContentProvider>
  );
}
