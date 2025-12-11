import { Children, isValidElement, ReactNode } from 'react';
import { isColumnsType } from './types';

export function findNonColumnsChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child): ReactNode => {
    if (isValidElement(child) && isColumnsType(child.type)) {
      return null;
    }
    return child;
  });
}

export function findColumns(children: ReactNode): ReactNode {
  return Children.map(children, (child): ReactNode => {
    if (isValidElement(child) && isColumnsType(child.type)) {
      return child;
    }
    return null;
  });
}

export function findColumnsByPart(
  columns: ReactNode,
  part: string | undefined,
): ReactNode {
  return Children.map(columns, (child) => {
    if (isValidElement(child)) {
      if (child.props.part === part) {
        return child.props.children;
      }
    }
    return null;
  });
}
