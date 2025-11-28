import { ReactNode } from 'react';
import { access, Accessor } from '../accessor/accessor';
import { ContentProvider, useContent } from '../content-provider';
import { DefaultContent } from './default-content';

export interface AccessorContentProps<V> {
  accessor: Accessor<V>;
  children?: ReactNode;
  value?: V;
}

const defaultChildren = <DefaultContent />;
/**
 * Transforms the content value using an accessor, then provides the result to children.
 * - Path string: Accesses nested properties like "user.address.city"
 * - Function: Calls the function with the content value
 * - undefined: Returns the content value unchanged
 * - null: Returns null
 *
 * Default children: <DefaultContent />
 */
export function AccessorContent<V>(props: AccessorContentProps<V>) {
  const { accessor, children = defaultChildren } = props;
  const content = useContent<V>(props.value);
  return (
    <ContentProvider value={access(content, accessor)}>
      {children}
    </ContentProvider>
  );
}
