import { ReactNode } from 'react';
import { useContent } from '../content-provider';

/**
 * Props for the {@link NullContent} component.
 */
export interface NullContentProps {
  /** Content to render when the content is null or undefined. */
  children?: ReactNode;
}

/**
 * Renders its children only when the content is null or undefined.
 * @remarks
 * Uses {@link useContent} to access the current content from the context.
 */
export function NullContent(props: NullContentProps) {
  const { children } = props;
  const content = useContent();
  if (content === null || content === undefined) {
    return <>{children}</>;
  }
  return null;
}
