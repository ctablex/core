import { ReactNode } from 'react';
import { useContent } from '../content-provider';

/**
 * Props for the {@link EmptyContent} component.
 */
export interface EmptyContentProps<C> {
  /** Content to render when the content is empty. */
  children?: ReactNode;
  /** Custom function to determine if content is empty. Defaults to {@link defaultIsEmpty}. */
  isEmpty?: (content: C) => boolean;
}

/**
 * Default implementation to check if content is empty.
 * @param content - The content to check
 * @returns `true` if content is an array with length 0, `false` otherwise
 */
export function defaultIsEmpty<C>(content: C): boolean {
  return Array.isArray(content) && content.length === 0;
}

/**
 * Renders its children only when the content is null, undefined, or empty.
 * @remarks
 * Uses {@link useContent} to access the current content from the context.
 * By default, uses {@link defaultIsEmpty} to check for empty arrays.
 */
export function EmptyContent<C>(props: EmptyContentProps<C>) {
  const { children, isEmpty = defaultIsEmpty } = props;
  const content = useContent<C>();
  if (content === null || content === undefined || isEmpty(content)) {
    return <>{children}</>;
  }
  return null;
}
