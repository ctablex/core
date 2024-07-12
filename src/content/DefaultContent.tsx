import React, { Fragment, PropsWithChildren } from 'react';
import { useContent } from './ContentContext';

interface DefaultContentOwnProps {}
export type DefaultContentProps = PropsWithChildren<DefaultContentOwnProps>;

export function DefaultContent(props: DefaultContentProps) {
  const value = useContent<any>();
  return <Fragment>{value}</Fragment>;
}
