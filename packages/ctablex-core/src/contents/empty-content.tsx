import { ReactNode } from 'react';
import { useContent } from '../content-provider';

export interface EmptyContentProps<C> {
  children?: ReactNode;
  isEmpty?: (content: C) => boolean;
}

export function defaultIsEmpty<C>(content: C): boolean {
  return Array.isArray(content) && content.length === 0;
}

export function EmptyContent<C>(props: EmptyContentProps<C>) {
  const { children, isEmpty = defaultIsEmpty } = props;
  const content = useContent<C>();
  if (content === null || content === undefined || isEmpty(content)) {
    return <>{children}</>;
  }
  return null;
}
