import React, { ReactNode } from 'react';
import { isColumnsType } from './ColumnsType';

export function findColumns(children: ReactNode): ReactNode {
  return React.Children.map(children, (child): ReactNode => {
    if (
      React.isValidElement<{ children?: ReactNode }>(child) &&
      isColumnsType(child.type)
    ) {
      return child;
    }
    return null;
  });
}
