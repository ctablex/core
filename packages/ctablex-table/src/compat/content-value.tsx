import { ContentProvider, DefaultContent, useContent } from '@ctablex/core';
import { ReactNode } from 'react';
import { getValue, Accessor } from '../accessor';

const defaultChildren = <DefaultContent />;

export interface ContentValueProps<D, C> {
  accessor: Accessor<D, C>;
  children?: ReactNode;
}

export function ContentValue<D, C>(props: ContentValueProps<D, C>) {
  const { children = defaultChildren } = props;
  const content = useContent<D>();
  const value = getValue(content, props.accessor);
  return <ContentProvider value={value}>{children}</ContentProvider>;
}
