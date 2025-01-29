import { ReactNode } from 'react';
import { useContent } from '../content-provider';
import { DefaultContent } from './default-content';

export interface NullableContentProps {
  children?: ReactNode;
  nullContent?: ReactNode;
}

const defaultChildren = <DefaultContent />;
export function NullableContent(props: NullableContentProps) {
  const { nullContent = null, children = defaultChildren } = props;
  const content = useContent();
  if (content === null || content === undefined) {
    return <>{nullContent}</>;
  }
  return <>{children}</>;
}
