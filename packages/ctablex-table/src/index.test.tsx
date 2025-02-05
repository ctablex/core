import { DefaultContent, IndexContent, useContent } from '@ctablex/core';
import { render, screen } from '@testing-library/react';
import React, { cloneElement, Fragment } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  TableElementsProvider,
  useTableElements,
} from './elements/table-elements-context';
import {
  Column,
  Columns,
  ContentValue,
  DataTable,
  Row,
  Rows,
  Table,
  TableBody,
  TableElements,
  TableHeader,
} from './index';
import { HeaderRow } from './table/header-row';

const IndexCell = () => {
  return (
    <>
      <IndexContent start={1} />.
    </>
  );
};

type Data = {
  id: string;
  name: string;
  price: number;
  count: number;
  color: string;
};
const data = [
  {
    id: '1',
    name: 'Gloves',
    price: 544,
    count: 5,
    color: 'plum',
  },
  {
    id: '2',
    name: 'Salad',
    price: 601,
    count: 6,
    color: 'turquoise',
  },
  {
    id: '3',
    name: 'Keyboard',
    price: 116,
    count: 1,
    color: 'silver',
  },
];

describe('ctablex', () => {
  it('should render table', () => {
    const { container } = render(
      <DataTable data={data}>
        <Columns>
          <Column>
            <IndexCell />
          </Column>
          <Column header="Name" accessor="name" />
          <Column header="Price" accessor="price" />
          <Column header="Count" accessor="count" />
          <Column header="Color" accessor="color" />
        </Columns>
        <Table />
      </DataTable>,
    );

    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<table><thead><tr><th></th><th>Name</th><th>Price</th><th>Count</th><th>Color</th></tr></thead><tbody><tr><td>1.</td><td>Gloves</td><td>544</td><td>5</td><td>plum</td></tr><tr><td>2.</td><td>Salad</td><td>601</td><td>6</td><td>turquoise</td></tr><tr><td>3.</td><td>Keyboard</td><td>116</td><td>1</td><td>silver</td></tr></tbody></table>"`,
    );
  });
  it('should support multiple content in cell', () => {
    const { container } = render(
      <DataTable data={data}>
        <Columns>
          <Column<Data> header="Name" accessor="name" />
          <Column header="Total">
            <ContentValue<Data> accessor="price" />
            {' x '}
            <ContentValue<Data> accessor="count" />
            {' = '}
            <ContentValue accessor={(r: any) => r.price * r.count} />
          </Column>
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<table><thead><tr><th>Name</th><th>Total</th></tr></thead><tbody><tr><td>Gloves</td><td>544 x 5 = 2720</td></tr><tr><td>Salad</td><td>601 x 6 = 3606</td></tr><tr><td>Keyboard</td><td>116 x 1 = 116</td></tr></tbody></table>"`,
    );

    expect(screen.getByText(/544 x 5 = 2720/)).toBeInTheDocument();
    expect(screen.getByText(/601 x 6 = 3606/)).toBeInTheDocument();
    expect(screen.getByText(/116 x 1 = 1/)).toBeInTheDocument();
  });
  it('should provide index context', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column>
            <IndexCell />
          </Column>
          <Column header="Name" accessor="name" />
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(screen.getByText(/1\./)).toBeInTheDocument();
    expect(screen.getByText(/2\./)).toBeInTheDocument();
    expect(screen.getByText(/3\./)).toBeInTheDocument();
  });
  it('should use custom Elements', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column
            header="Name"
            accessor="name"
            thEl={<th color="red" data-testid="el-th" />}
            el={<td color="blue" data-testid="el-td" />}
          />
        </Columns>
        <Table el={<table data-testid="el-table" />}>
          <TableHeader el={<thead data-testid="el-thead" />}>
            <HeaderRow el={<tr data-testid="el-header-row" />} />
          </TableHeader>
          <TableBody el={<tbody data-testid="el-tbody" />}>
            <Rows>
              <Row el={<tr data-testid="el-row" />} />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(screen.getByTestId('el-table')).toBeInTheDocument();
    expect(screen.getByTestId('el-thead')).toBeInTheDocument();
    expect(screen.getByTestId('el-header-row')).toBeInTheDocument();
    expect(screen.getByTestId('el-tbody')).toBeInTheDocument();
    expect(screen.getAllByTestId('el-row')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('el-th')[0]).toHaveAttribute('color', 'red');
    expect(screen.queryAllByTestId('el-td')[0]).toHaveAttribute(
      'color',
      'blue',
    );
  });

  it('should use custom Elements from context', () => {
    const elements: TableElements = {
      table: <table data-testid="ctx-table" />,
      thead: <thead data-testid="ctx-thead" />,
      tbody: <tbody data-testid="ctx-tbody" />,
      tr: <tr data-testid="ctx-tr" />,
      th: <th data-testid="ctx-th" />,
      td: <td data-testid="ctx-td" />,
    };
    render(
      <TableElementsProvider value={elements}>
        <DataTable data={data}>
          <Columns>
            <Column header="Name" accessor="name" />
          </Columns>
          <Table>
            <TableHeader>
              <HeaderRow />
            </TableHeader>
            <TableBody>
              <Rows>
                <Row />
              </Rows>
            </TableBody>
          </Table>
        </DataTable>
      </TableElementsProvider>,
    );
    expect(screen.getByTestId('ctx-table')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-thead')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-tbody')).toBeInTheDocument();
    expect(screen.getAllByTestId('ctx-tr')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('ctx-th')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('ctx-td')[0]).toBeInTheDocument();
  });

  it('should prefer el props over Elements from context', () => {
    const elements: TableElements = {
      table: <table data-testid="ctx-table" />,
      thead: <thead data-testid="ctx-thead" />,
      tbody: <tbody data-testid="ctx-tbody" />,
      tr: <tr data-testid="ctx-tr" />,
      th: <th data-testid="ctx-th" />,
      td: <td data-testid="ctx-td" />,
    };
    render(
      <TableElementsProvider value={elements}>
        <DataTable data={data}>
          <Columns>
            <Column
              header="Name"
              accessor="name"
              thEl={<th color="red" data-testid="el-th" />}
              el={<td color="blue" data-testid="el-td" />}
            />
          </Columns>
          <Table el={<table data-testid="el-table" />}>
            <TableHeader el={<thead data-testid="el-thead" />}>
              <HeaderRow el={<tr data-testid="el-header-row" />} />
            </TableHeader>
            <TableBody el={<tbody data-testid="el-tbody" />}>
              <Rows>
                <Row el={<tr data-testid="el-row" />} />
              </Rows>
            </TableBody>
          </Table>
        </DataTable>
      </TableElementsProvider>,
    );
    expect(screen.getByTestId('el-table')).toBeInTheDocument();
    expect(screen.getByTestId('el-thead')).toBeInTheDocument();
    expect(screen.getByTestId('el-header-row')).toBeInTheDocument();
    expect(screen.getByTestId('el-tbody')).toBeInTheDocument();
    expect(screen.getAllByTestId('el-row')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('el-th')[0]).toHaveAttribute('color', 'red');
    expect(screen.getAllByTestId('el-td')[0]).toHaveAttribute('color', 'blue');
  });

  it('should use custom Elements with custom child', () => {
    const MyRow = (props: { activeId: string }) => {
      const elements = useTableElements();
      const value = useContent<Data>();
      const active = value.id === props.activeId;
      return cloneElement(elements.tr, {
        'data-testid': 'row',
        className: active ? 'active' : undefined,
      });
    };
    render(
      <DataTable data={data}>
        <Columns>
          <Column header="Name" accessor="name" />
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows>
              <Row el={<MyRow activeId="2" />} />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(screen.getAllByTestId('row')[1]).toHaveClass('active');
  });

  it('should use custom key accessor', () => {
    const fn = vi.fn((row: any) => row.id);
    render(
      <DataTable data={data}>
        <Columns>
          <Column header="Name" accessor="name" />
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows keyAccessor={fn}>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(fn).toBeCalled();
  });
  it('should render empty column', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column accessor={null} />
          <Column accessor="name" children="" />
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    const tds = screen.getAllByRole('cell');

    expect(tds).toHaveLength(6);
    tds.forEach((td) => expect(td).toHaveTextContent(''));
    const ths = screen.getAllByRole('columnheader');
    expect(ths).toHaveLength(2);
  });
  it('should render a custom Row with external data', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column header="Name" accessor="name" />
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Row row={data[0]} />
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(screen.getByText('Gloves')).toBeInTheDocument();
  });
  it('should render a custom Row with different columns definition', () => {
    const count = data.map((row) => row.count).reduce((a, b) => a + b, 0);
    const summary = { count };
    render(
      <DataTable data={data}>
        <Columns>
          <Column header="Name" accessor="name" />
          <Column header="Count" accessor="count" />
        </Columns>
        <Columns part="summary">
          <Column>Total</Column>
          <Column accessor="count">
            <DefaultContent /> (Sum)
          </Column>
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow>
              <Columns />
            </HeaderRow>
          </TableHeader>
          <TableBody>
            <Row row={summary}>
              <Columns part="summary" />
            </Row>
            <Rows>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(screen.getByText('12 (Sum)')).toBeInTheDocument();
  });
  it('should render all none columns children', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column />
        </Columns>
        other
        <span>child</span>
      </DataTable>,
    );
    expect(screen.getByText('other')).toBeInTheDocument();
  });
  it('should throw error if render outside of data-table', () => {
    // @ts-ignore
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Columns />)).toThrow();
  });
});
