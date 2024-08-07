import { useContent } from '@ctablex/core';
import { Fragment, PropsWithChildren, ReactNode } from 'react';

interface OwnProps {
  yes?: ReactNode;
  no?: ReactNode;
}

export type Props = PropsWithChildren<OwnProps>;

export function BooleanContent(props: Props) {
  const content = useContent<boolean>();

  return (
    <Fragment>
      {content === true && props.yes}
      {content === false && props.no}
    </Fragment>
  );
}
