import { ReactNode } from 'react';
import { useContent } from '../content-provider';
import { defaultIsEmpty } from './empty-content';

/**
 * Props for the {@link NonEmptyContent} component.
 */
export interface NonEmptyContentProps<C> {
  /** Content to render when the content is not empty. */
  children?: ReactNode;
  /** Custom function to determine if content is empty. By default, only arrays with length 0 are considered empty. */
  isEmpty?: (content: C) => boolean;
}

/**
 * Renders its children only when the content is not null, not undefined, and not empty.
 * @remarks
 * Uses {@link useContent} to access the current content from the context.
 * By default, only arrays with length 0 are considered empty.
 */
export function NonEmptyContent<C>(props: NonEmptyContentProps<C>) {
  const { children, isEmpty = defaultIsEmpty } = props;
  const content = useContent<C>();
  if (content === null || content === undefined || isEmpty(content)) {
    return null;
  }
  return <>{children}</>;
}
