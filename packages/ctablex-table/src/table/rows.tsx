import { AccessorTo, accessTo, ArrayContent } from '@ctablex/core';
import { ReactNode, useCallback } from 'react';
import { Row } from './row';

const defaultChildren = <Row />;

export interface RowsProps<D> {
  keyAccessor?: AccessorTo<D, string | number>;
  children?: ReactNode;
  rows?: ReadonlyArray<D>;
}

export function Rows<D>(props: RowsProps<D>) {
  const keyAccessor = props.keyAccessor;
  const { children = defaultChildren } = props;
  const getKey = useCallback(
    (data: D, index: number): number | string => {
      if (!keyAccessor) {
        return index;
      }
      return accessTo(data, keyAccessor);
    },
    [keyAccessor],
  );
  return (
    <ArrayContent value={props.rows} getKey={getKey}>
      {children}
    </ArrayContent>
  );
}
