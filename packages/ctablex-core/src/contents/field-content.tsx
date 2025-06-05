import type { ReactNode } from 'react';
import { ContentProvider, useContent } from '../content-provider';
import { DefaultContent } from './default-content';

export interface FieldContentProps<V> {
  field: keyof V;
  children?: ReactNode;
}

const defaultChildren = <DefaultContent />;
export function FieldContent<V>(props: FieldContentProps<V>) {
  const { field, children = defaultChildren } = props;
  const content = useContent<V>();
  return <ContentProvider value={content[field]}>{children}</ContentProvider>;
}
