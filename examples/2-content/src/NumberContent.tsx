import { useContent } from '@ctablex/core';
import { Fragment } from 'react';

const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export function NumberContent() {
  const content = useContent<number>();
  const str = formatter.format(content);
  return <Fragment>{str}</Fragment>;
}
