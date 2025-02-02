import { ReactElement } from 'react';

export interface TableElements {
  table: ReactElement;
  thead: ReactElement;
  tbody: ReactElement;
  tr: ReactElement;
  th: ReactElement;
  td: ReactElement;
}

export const defaultTableElements: TableElements = {
  table: <table />,
  thead: <thead />,
  tbody: <tbody />,
  tr: <tr />,
  th: <th />,
  td: <td />,
};
