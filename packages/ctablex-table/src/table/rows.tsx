import { access, Accessor, ArrayContent, ContentProvider, useContent } from '@ctablex/core';
import { ReactNode, useCallback } from 'react';
import { Row } from './row';

const defaultChildren = <Row />;

export interface RowsProps<D> {
  keyAccessor?: Accessor<D, string | number>;
  children?: ReactNode;
  rows?: ReadonlyArray<D>;
}

export function Rows<D>(props: RowsProps<D>) {
  const keyAccessor = props.keyAccessor;
  const { children = defaultChildren } = props;
  const rows = useContent(props.rows);
  const getKey = useCallback(
    (data: D, index: number) => {
      if (!keyAccessor) {
        return index;
      }
      // @ts-nocheck
      return access(data, keyAccessor);
    },
    [keyAccessor],
  );
  return (
    <ContentProvider value={rows}>
      <ArrayContent getKey={getKey}>{children}</ArrayContent>
    </ContentProvider>
  );
}
