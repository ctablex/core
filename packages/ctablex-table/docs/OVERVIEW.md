# Overview

This document provides an example and shows how it works, then step by step shows how it can be customized.

## TL;DR

- **Basic example and component expansion**: See how a simple `<Table />` component automatically expands into `<TableHeader />`, `<TableBody />`, rows, and cells through default children
- **Customize cell content**: Learn to create custom content components like `NumberContent` that read from context and format data your way
- **Customize elements**: Discover how to swap default HTML elements using `TableElementsProvider` or the `el` prop to match your design system
- **Customize structure**: Explore techniques for changing table structure—add footers, remove headers, render multiple rows per item, or replace the table entirely with custom layouts

## Prerequisites

Before diving into this document, you should understand the **micro-context pattern** that powers ctablex. Read **[@ctablex/core MICRO-CONTEXT.md](../../ctablex-core/docs/MICRO-CONTEXT.md)** to learn about:

- How context flows data through component hierarchies
- The `ContentProvider` and `useContent` pattern
- Why this approach enables composable, decoupled components

## Basic Example

This basic example shows how to create a simple data table with two columns: "Name" and "Price". The data is provided as an array of objects.

```tsx
import { DataTable, Columns, Column, Table } from '@ctablex/table';

function BasicExample() {
  const products = [
    { name: 'Apple', price: 1.2 },
    { name: 'Banana', price: 0.5 },
    { name: 'Cherry', price: 2.0 },
  ];

  return (
    <DataTable data={products}>
      <Columns>
        <Column accessor="name" header="Name" />
        <Column accessor="price" header="Price" />
      </Columns>
      <Table />
    </DataTable>
  );
}
```

This code creates a simple data table displaying the names and prices of fruits.

Final rendered table:

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Apple</td>
      <td>1.2</td>
    </tr>
    <tr>
      <td>Banana</td>
      <td>0.5</td>
    </tr>
    <tr>
      <td>Cherry</td>
      <td>2.0</td>
    </tr>
  </tbody>
</table>
```

Now let's go step by step to see how this transformation happens.

### Step 1: DataTable extracts and removes Columns

DataTable extracts column definitions (`<Columns>...</Columns>`) from its immediate children, provides them via `ColumnsContext`, and removes them from the render tree. After this step, here's what actually renders:

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table />
</DataTable>
```

### Step 2: Table expands to default children

Because the micro-context pattern passes data via context rather than props, child components don't receive changing data props. This allows us to use proper default children.

`<Table />` expands to its default children: `<TableHeader />` and `<TableBody />`. So now we have the following code, which is exactly the same as above:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader />
    <TableBody />
  </Table>
</DataTable>
```

### Step 3: TableHeader

TableHeader also has default children. It expands to HeaderRow:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>
      <HeaderRow />
    </TableHeader>
    <TableBody />
  </Table>
</DataTable>
```

HeaderRow also has default children. It expands to `Columns`:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>
      <HeaderRow>
        <Columns />
      </HeaderRow>
    </TableHeader>
    <TableBody />
  </Table>
</DataTable>
```

As you remember, `Columns` was extracted by DataTable from immediate children, and provided via context. So here,
Columns reads columns from context and renders them here:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>
      <HeaderRow>
        {/* Children of <Columns> */}
        <Column accessor="name" header="Name" />
        <Column accessor="price" header="Price" />
      </HeaderRow>
    </TableHeader>
    <TableBody />
  </Table>
</DataTable>
```

TableHeader provides IsHeaderContext (set to true). Column reads IsHeaderContext via useIsHeader() and detects that it is rendering in the header, so it renders HeaderCell:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>
      <HeaderRow>
        {/* Name and Price are header props of Column */}
        <HeaderCell>Name</HeaderCell>
        <HeaderCell>Price</HeaderCell>
      </HeaderRow>
    </TableHeader>
    <TableBody />
  </Table>
</DataTable>
```

### Step 4: TableBody

TableBody also has default children. It expands to DataRows:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>{/* ... */}</TableHeader>
    <TableBody>
      <Rows />
    </TableBody>
  </Table>
</DataTable>
```

Rows also has default children. It expands to Row:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>{/* ... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row />
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

Rows with the help of `ArrayContent` (a component from `@ctablex/core` that iterates over arrays) iterates over the products array, providing each item via ContentProvider.

You can think of it like this:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>{/* ... */}</TableHeader>
    <TableBody>
      <ContentProvider value={products[0]}>
        <Row />
      </ContentProvider>
      <ContentProvider value={products[1]}>
        <Row />
      </ContentProvider>
      {/* ... for each product ... */}
    </TableBody>
  </Table>
</DataTable>
```

Row also has default children. It expands to Columns:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>{/* ... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row>
          <Columns />
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

As before, Columns reads columns from context and renders them here:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>{/* ... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row>
          {/* Children of <Columns> */}
          <Column accessor="name" header="Name" />
          <Column accessor="price" header="Price" />
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

Column also has default children, so if no children are provided, it uses `<DefaultContent />`:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>{/* ... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row>
          <Columns>
            <Column header="Name" accessor="name">
              <DefaultContent />
            </Column>
            <Column header="Price" accessor="price">
              <DefaultContent />
            </Column>
          </Columns>
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

IsHeaderContext is not provided here, so Column detects that it is not rendering in the header, so it renders Cell:

```tsx
<DataTable data={products}>
  <Table>
    <TableHeader>{/* ... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row>
          <Columns>
            <Cell accessor="name">
              <DefaultContent />
            </Cell>
            <Cell accessor="price">
              <DefaultContent />
            </Cell>
          </Columns>
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

Cell extracts the value from content context using accessor and provides it via ContentProvider to its children.

DefaultContent reads the value from content context and renders it.

Table, TableHeader, TableBody, HeaderRow, Row, HeaderCell, Cell render appropriate HTML elements like `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`. So:

```tsx
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    {/* <Rows /> does not render DOM itself, it iterates over products */}
    <tr>
      <td>{products[0].name}</td>
      <td>{products[0].price}</td>
    </tr>
    <tr>
      <td>{products[1].name}</td>
      <td>{products[1].price}</td>
    </tr>
    {/* ... for each product ... */}
  </tbody>
</table>
```

This results in the final rendered table as shown in the basic example.

## Customization

### Custom Cell Content

You can customize the content of each cell by providing your own children to the `Column` component. For example, to format the price with a dollar sign:

```tsx
<DataTable data={products}>
  <Columns>
    <Column accessor="name" header="Name" />
    <Column accessor="price" header="Price">
      <NumberContent digits={2} /> dollars
    </Column>
  </Columns>
  <Table />
</DataTable>
```

```tsx
import { useContent } from '@ctablex/core';

function NumberContent({ digits }: { digits: number }) {
  const value = useContent<number>();
  return <>{value.toFixed(digits)}</>;
}
```

You can define reusable content components like `NumberContent` that read the value from content context using `useContent()` and display it in a customized way. In this example, the Column will render "1.20 dollars" where `1.20` comes from `NumberContent` and `" dollars"` is rendered as the second child of the Column.

### Custom elements

Two ways to customize elements used in table rendering:

1. Using TableElementsContext: You can provide custom elements for all table components by using the `TableElementsProvider` component.
2. Using `el` prop: You can provide custom elements for specific components using the `el` prop. Child props will be added to the provided element. Column also supports `thEl` prop to provide custom header cell element.

```tsx
const elements = {
  table: <table className="fancy-table" />,
  thead: <thead className="fancy-thead" />,
  tbody: <tbody className="fancy-tbody" />,
  tr: <tr className="fancy-tr" />,
  th: <th className="fancy-th" />,
  td: <td className="fancy-td" />,
};
```

```tsx
<TableElementProvider value={elements}>
  <DataTable data={products}>
    <Columns>
      <Column header="Name" accessor="name" />
      <Column
        header="Price"
        accessor="price"
        el={<td className="price-cell" />}
        thEl={<th className="price-header" />}
      >
        <NumberContent digits={2} /> dollars
      </Column>
    </Columns>
    <Table>
      <TableHeader />
      <TableBody>
        <Rows>
          <Row el={<CustomRow />} />
        </Rows>
      </TableBody>
    </Table>
  </DataTable>
</TableElementProvider>
```

`<CustomRow />` will be rendered for each row. It can have access to ContentContext via `useContent` and render a customized row based on data.

```tsx
function CustomRow({ children }: { children: ReactNode }) {
  const item = useContent<{ name: string; price: number }>();
  return (
    <tr className={item.price > 10 ? 'expensive' : 'cheap'}>{children}</tr>
  );
}
```

### Table Structure

A more advanced kind of customization is changing table structure, for example adding a footer. Instead of relying on default children, you can provide your own children to Table:

```tsx
<DataTable data={data}>
  <Columns>
    <Column accessor="name" header="Name" />
    <Column accessor="price" header="Price" />
  </Columns>
  <Table>
    <TableHeader />
    <TableBody />
    <TableFooter>{/* custom footer content */}</TableFooter>
  </Table>
</DataTable>
```

Or you can remove the header:

```tsx
<DataTable data={data}>
  <Columns>
    <Column accessor="name" header="Name" />
    <Column accessor="price" header="Price" />
  </Columns>
  <Table>
    <TableBody />
  </Table>
</DataTable>
```

Or render a special row:

```tsx
<DataTable data={data}>
  <Columns>
    <Column accessor="name" header="Name" />
    <Column accessor="price" header="Price" />
  </Columns>
  <Table>
    <TableHeader />
    <TableBody>
      <Row>
        <tr>
          <td colSpan={2}>Special Row</td>
        </tr>
      </Row>
      {/* default rows */}
      <Rows />
    </TableBody>
  </Table>
</DataTable>
```

You can render more than one row per item. The `part` prop will help you define more than one columns definition:

```tsx
<DataTable data={data}>
  <Columns>
    <Column accessor="name" header="Name" />
    <Column accessor="price" header="Price" />
  </Columns>
  <Columns part="description">
    <Column accessor="description" el={<td colSpan={2} />} />
  </Columns>
  <Table>
    <TableHeader />
    <TableBody>
      <Rows>
        {/* default row. uses <Column/> as default children */}
        <Row />
        {/* additional row for description */}
        <Row>
          {/* find description columns definition by part="description" from columns context */}
          <Columns part="description" />
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

You can even remove Table and implement your own table structure using lower-level components like `ArrayContent` and `ContentValue` from `@ctablex/core`:

```tsx
import { ArrayContent, ContentValue } from '@ctablex/core';

<DataTable data={data}>
  <Columns>
    <span>
      name:{' '}
      <b>
        <ContentValue accessor="name" />
      </b>
    </span>
    <br />
    <span>
      price: $
      <b>
        <ContentValue accessor="price" />
      </b>
    </span>
  </Columns>
  <div className="list">
    <ArrayContent>
      <div className="item">
        <Columns />
      </div>
    </ArrayContent>
  </div>
</DataTable>;
```

You can also remove `Columns` from immediate children of DataTable and define children of Row and HeaderRow directly:

```tsx
<DataTable data={data}>
  <Table>
    <TableHeader>
      <HeaderRow>
        <th>Name</th>
        <th>Price</th>
      </HeaderRow>
    </TableHeader>
    <TableBody>
      <Rows>
        <Row>
          <td>
            <ContentValue accessor="name" />
          </td>
          <td>
            <ContentValue accessor="price" />
          </td>
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

## Type Safety

Micro-context provides weak type safety. Generic types must be manually specified and cannot be validated across context boundaries. See [MICRO-CONTEXT.md - Weak Type Safety](../../ctablex-core/docs/MICRO-CONTEXT.md#weak-type-safety) for details.

However, when you provide a generic type to the `<Column>` element, strong type safety is provided for the accessor prop, including support for nested paths with autocomplete:

```ts
interface Product {
  name: string;
  price: number;
  info: {
    weight: number;
  };
}
```

```tsx
<DataTable data={data}>
  <Columns>
    <Column<Product> accessor="name" header="Name" />
    <Column<Product> accessor="price" header="Price" />
    {/* Nested paths are fully supported with autocomplete */}
    <Column<Product> accessor="info.weight" header="Weight" />
    {/* Error: Type '"invalidProp"' is not assignable to type 'name' | 'price' | 'info' | 'info.weight' */}
    <Column<Product> accessor="invalidProp" header="Invalid" />
  </Columns>
</DataTable>
```

The accessor prop supports nested object paths (like `"info.weight"`) with full TypeScript autocomplete and type checking.

## Conclusion

That's the tour! You've seen how `@ctablex/table` works from the ground up:

- **Step-by-step transformation**: How `<Table />` expands into headers, rows, and cells through default children
- **The micro-context magic**: Data and column definitions flow through context, so you're not passing props everywhere
- **Customization levels**: From dropping in a custom content component to completely rebuilding the table structure
- **Type safety**: Generic types on `<Column>` give you autocomplete and type checking for nested paths

The key insight? Because components use context instead of props, they can have proper default children that automatically work with your data. This means minimal code for simple cases, but you can drill down and customize at any level when you need to.

Start simple, customize when needed. That's the ctablex way. Happy coding! 🚀
