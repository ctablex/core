import { cloneElement, ReactElement } from 'react';

export function addProps(el: ReactElement, props: Record<string, any>) {
  return cloneElement(cloneElement(el, props), el.props);
}
