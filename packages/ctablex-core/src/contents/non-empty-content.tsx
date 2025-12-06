import { ReactNode } from 'react';
import { useContent } from '../content-provider';
import { defaultIsEmpty } from './empty-content';

export interface NonEmptyContentProps<C> {
  children?: ReactNode;
  isEmpty?: (content: C) => boolean;
}

export function NonEmptyContent<C>(props: NonEmptyContentProps<C>) {
  const { children, isEmpty = defaultIsEmpty } = props;
  const content = useContent<C>();
  if (content === null || content === undefined || isEmpty(content)) {
    return null;
  }
  return <>{children}</>;
}
