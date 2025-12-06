import { ReactNode } from 'react';
import { useContent } from '../content-provider';

export interface NullContentProps {
  children?: ReactNode;
}

export function NullContent(props: NullContentProps) {
  const { children } = props;
  const content = useContent();
  if (content === null || content === undefined) {
    return <>{children}</>;
  }
  return null;
}
