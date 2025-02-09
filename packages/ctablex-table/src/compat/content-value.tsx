import {
  access,
  Accessor,
  ContentProvider,
  DefaultContent,
  useContent,
} from '@ctablex/core';
import { ReactNode } from 'react';

const defaultChildren = <DefaultContent />;

export interface ContentValueProps<D> {
  accessor: Accessor<D>;
  children?: ReactNode;
}

export function ContentValue<D = any>(props: ContentValueProps<D>) {
  const { children = defaultChildren } = props;
  const content = useContent<D>();
  const value = access(content, props.accessor);
  return <ContentProvider value={value}>{children}</ContentProvider>;
}
