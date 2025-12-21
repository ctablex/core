# Components API Reference

Complete reference for all components in **@ctablex/table**.

## Table of Contents

- [DataTable](#datatable)
- [Table](#table)
- [TableHeader](#tableheader)
- [TableBody](#tablebody)
- [TableFooter](#tablefooter)
- [Columns](#columns)
- [Column](#column)
- [Rows](#rows)
- [Row](#row)
- [Re-exported Components](#re-exported-components)

---

## DataTable

The root component that provides data and column definitions to the table.

### Props

```tsx
interface DataTableProps<D> {
  data?: ReadonlyArray<D>;
  children: ReactNode;
}
```

#### `data`

**Type:** `ReadonlyArray<D>` (optional)

The array of data to display in the table. Each item represents a row.

```tsx
const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 },
];

<DataTable data={products}>{/* ... */}</DataTable>;
```

**Note:** If omitted, data can be provided via `useContent` from a parent context.

#### `children`

**Type:** `ReactNode`

Should contain `Columns` definitions and a `Table` component.

### Usage

```tsx
<DataTable data={items}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table />
</DataTable>
```

### What It Does

1. Provides data array via `ContentProvider`
2. Extracts column definitions from children (those marked with `__COLUMNS__`)
3. Removes extracted columns from the render tree
4. Provides columns via `ColumnsProvider` for later rendering

### Type Parameter

```tsx
type Product = { id: number; name: string; price: number };

{
  /* TypeScript validates the data prop matches Product[] */
}
<DataTable<Product> data={products}>{/* ... */}</DataTable>;
```

---

## Table

Renders the `<table>` element and its structure.

### Props

```tsx
interface TableProps {
  el?: ReactElement;
  children?: ReactNode;
}
```

#### `el`

**Type:** `ReactElement` (optional)

Custom element to render instead of `<table>`. See [CUSTOMIZATION.md](./CUSTOMIZATION.md).

```tsx
<Table el={<table className="custom-table" />} />
```

#### `children`

**Type:** `ReactNode` (optional, defaults to `<TableHeader />` + `<TableBody />`)

Table sections to render.

### Default Children

```tsx
// These are equivalent:
<Table />

<Table>
  <TableHeader />
  <TableBody />
</Table>
```

### Usage

**Basic:**

```tsx
<Table />
```

**Custom structure:**

```tsx
<Table>
  <TableHeader />
  <TableBody>
    <Rows>
      <Row>
        <Columns />
      </Row>
    </Rows>
  </TableBody>
  <TableFooter>
    <Row row={summaryData}>
      <Columns part="footer" />
    </Row>
  </TableFooter>
</Table>
```

---

## TableHeader

Renders the `<thead>` element.

### Props

```tsx
interface TableHeaderProps {
  el?: ReactElement;
  children?: ReactNode;
}
```

#### `el`

**Type:** `ReactElement` (optional)

Custom element to render instead of `<thead>`.

#### `children`

**Type:** `ReactNode` (optional, defaults to `<HeaderRow />`)

Content inside the header.

### Default Children

```tsx
// These are equivalent:
<TableHeader />

<TableHeader>
  <HeaderRow />
</TableHeader>
```

### Usage

```tsx
<Table>
  <TableHeader />
  <TableBody />
</Table>
```

### What It Does

1. Renders `<thead>` element
2. Provides `IsHeaderContext` (set to true) so `Column` components render as header cells

---

## TableBody

Renders the `<tbody>` element.

### Props

```tsx
interface TableBodyProps {
  el?: ReactElement;
  children?: ReactNode;
}
```

#### `el`

**Type:** `ReactElement` (optional)

Custom element to render instead of `<tbody>`.

#### `children`

**Type:** `ReactNode` (optional, defaults to `<Rows />`)

Content inside the body.

### Default Children

```tsx
// These are equivalent:
<TableBody />

<TableBody>
  <Rows />
</TableBody>
```

### Usage

**Basic:**

```tsx
<TableBody />
```

**With custom rows:**

```tsx
<TableBody>
  <Rows keyAccessor="id">
    <Row>
      <Columns />
    </Row>
  </Rows>
</TableBody>
```

### What It Does

1. Renders `<tbody>` element
2. Does not provide `IsHeaderContext` (defaults to false), so `Column` components render as data cells

---

## TableFooter

Renders the `<tfoot>` element.

### Props

```tsx
interface TableFooterProps {
  el?: ReactElement;
  children?: ReactNode;
}
```

#### `el`

**Type:** `ReactElement` (optional)

Custom element to render instead of `<tfoot>`.

#### `children`

**Type:** `ReactNode`

Footer content, typically custom rows with summary data.

### Usage

```tsx
<TableFooter>
  <Row row={summaryData}>
    <Columns part="summary" />
  </Row>
</TableFooter>
```

### What It Does

1. Renders `<tfoot>` element
2. Does not provide `IsHeaderContext` (defaults to false), so `Column` components render as data cells

---

## Columns

Container for column definitions. Renders the appropriate columns based on the current part context.

### Props

```tsx
interface ColumnsProps {
  part?: string;
  children?: ReactNode;
}
```

#### `part`

**Type:** `string` (optional)

The part identifier for this column set. Columns without a part are the default.

```tsx
// Default columns (rendered in standard rows)
<Columns>
  <Column header="Name" accessor="name" />
  <Column header="Price" accessor="price" />
</Columns>

// Named part (rendered when explicitly requested)
<Columns part="footer">
  <Column>Total:</Column>
  <Column accessor="total" />
</Columns>
```

#### `children`

**Type:** `ReactNode`

`Column` components defining the column structure.

### Usage

**Single column set:**

```tsx
<Columns>
  <Column header="Name" accessor="name" />
  <Column header="Email" accessor="email" />
</Columns>
```

**Multiple parts:**

```tsx
<DataTable data={items}>
  <Columns>
    <Column header="Item" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>

  <Columns part="summary">
    <Column>Total:</Column>
    <Column accessor="total" />
  </Columns>

  <Table>
    <TableHeader />
    <TableBody>
      <Rows /> {/* Renders default Columns */}
    </TableBody>
    <TableFooter>
      <Row row={summaryData}>
        <Columns part="summary" /> {/* Renders summary Columns */}
      </Row>
    </TableFooter>
  </Table>
</DataTable>
```

**⚠️ Important:** `Columns` must be an **immediate child** of `DataTable` for column extraction to work.

**Not allowed:**

```tsx
<DataTable data={items}>
  <>
    <Columns /> {/* ✗ Not ok - Columns wrapped in fragment */}
  </>
</DataTable>

<DataTable data={items}>
  <MyColumns /> {/* ✗ Not ok - Columns wrapped in custom component */}
</DataTable>
```

**Workaround for wrapping `Columns`:**

If you need to wrap `Columns` itself in a custom component, mark it with `__COLUMNS__`:

```tsx
function MyColumns() {
  return (
    <Columns>
      <Column header="Name" accessor="name" />
      <Column header="Price" accessor="price" />
    </Columns>
  );
}

MyColumns.__COLUMNS__ = true; // Mark as column container

<DataTable data={items}>
  <MyColumns /> {/* ✓ Now works */}
</DataTable>;
```

**Note:** Custom components _inside_ `Columns` (wrapping `Column` components) work fine without any special marking:

```tsx
function MyColumn() {
  return <Column header="Name" accessor="name" />;
}

<DataTable data={items}>
  <Columns>
    <MyColumn /> {/* ✓ OK - custom component inside Columns */}
  </Columns>
</DataTable>;
```

### What It Does

When defined at the top level of `DataTable`:

- The component is extracted and removed from the render tree
- Its children are provided in `ColumnsContext`

When rendered inside the table structure (e.g., in `HeaderRow` or `Row`):

- Retrieves provided columns from context
- Filters columns by the `part` prop
- Renders matching `Column` components

---

## Column

Defines a column's structure and rendering logic. Dual-mode component that renders differently based on context.

### Props

```tsx
interface ColumnProps<D = any> {
  children?: ReactNode;
  header?: ReactNode;
  accessor?: Accessor<D>;
  el?: ReactElement;
  thEl?: ReactElement;
}
```

#### `header`

**Type:** `ReactNode` (optional)

Content to display in the header cell (`<th>`).

```tsx
<Column header="Product Name" accessor="name" />
<Column header={<strong>Price</strong>} accessor="price" />
```

#### `accessor`

**Type:** `Accessor<D>` (optional)

Extracts the value from row data. Can be a string path or function.

**String accessor:**

```tsx
<Column accessor="name" />
<Column accessor="user.address.city" />
```

**Function accessor:**

```tsx
<Column accessor={(row) => row.price * row.quantity} />
<Column accessor={(user) => `${user.firstName} ${user.lastName}`} />
```

**No accessor (undefined):**

When `accessor` is omitted, the entire row object is provided to children without extraction. This is useful for complex content using `ContentValue`:

```tsx
<Column header="Details">
  <ContentValue accessor="firstName">
    <DefaultContent />
  </ContentValue>{' '}
  <ContentValue accessor="lastName">
    <DefaultContent />
  </ContentValue>
</Column>
```

⚠️ **Note:** Since the default child is `<DefaultContent />`, omitting the accessor with default children will cause a React error (objects cannot be rendered). For empty cells, pass `{null}` as children:

```tsx
{
  /* Empty cell with null children */
}
<Column header="Actions">{null}</Column>;

{
  /* Or with custom content */
}
<Column header="Actions">
  <button>Edit</button>
</Column>;
```

#### `children`

**Type:** `ReactNode` (optional, defaults to `<DefaultContent />`)

Content renderers that receive the extracted value via context.

```tsx
<Column accessor="price">
  <NumberFormatter />
</Column>

<Column accessor="isActive">
  <BooleanContent yes="✓" no="✗" />
</Column>
```

#### `el`

**Type:** `ReactElement` (optional)

Custom element for the data cell (`<td>`).

```tsx
<Column accessor="price" el={<td className="price-cell" />} />
```

#### `thEl`

**Type:** `ReactElement` (optional)

Custom element for the header cell (`<th>`).

```tsx
<Column header="Price" thEl={<th className="header-cell" />} />
```

### Usage

**Simple column:**

```tsx
<Column header="Name" accessor="name" />
```

**With custom content:**

```tsx
<Column header="Price" accessor="price">
  <NumberFormatter decimals={2} />
</Column>
```

**Computed value:**

```tsx
<Column header="Total" accessor={(item) => item.price * item.quantity}>
  <NumberFormatter />
</Column>
```

**Complex cell:**

```tsx
<Column header="Summary">
  <ContentValue accessor="firstName">
    <DefaultContent />
  </ContentValue>{' '}
  <ContentValue accessor="lastName">
    <DefaultContent />
  </ContentValue>
</Column>
```

### What It Does

**When IsHeaderContext is true (inside TableHeader):**

- Renders `<HeaderCell>` with `header` prop as children
- use `thEl` if provided, otherwise `<th>`

**When IsHeaderContext is false/undefined (inside TableBody or TableFooter):**

- Renders `<Cell>` with:
  - Value extracted via `accessor`
  - Value provided to children via `ContentProvider`
- use `el` if provided, otherwise `<td>`

### Type Parameter

```tsx
type Product = { id: number; name: string; price: number };

<Column<Product> accessor="name" />; // TypeScript validates field
```

---

## Rows

Iterates over the data array, rendering a row for each item.

### Props

```tsx
interface RowsProps<D> {
  keyAccessor?: AccessorTo<D, string | number>;
  children?: ReactNode;
  rows?: ReadonlyArray<D>;
}
```

#### `keyAccessor`

**Type:** `AccessorTo<D, string | number>` (optional)

Extracts the React key for each row. If omitted, array index is used.

```tsx
<Rows keyAccessor="id" />
<Rows keyAccessor={(user) => user.email} />
```

#### `children`

**Type:** `ReactNode` (optional, defaults to `<Row />`)

The row component to render for each item.

#### `rows`

**Type:** `ReadonlyArray<D>` (optional)

Override data array. If omitted, uses data from context.

### Default Children

```tsx
// These are equivalent:
<Rows />

<Rows>
  <Row />
</Rows>
```

### Usage

**Basic:**

```tsx
<Rows />
```

**With key:**

```tsx
<Rows keyAccessor="id" />
```

**Custom row:**

```tsx
<Rows keyAccessor="id">
  <Row>
    <Columns />
  </Row>
</Rows>
```

### What It Does

1. Uses `ArrayContent` from `@ctablex/core` to iterate data
2. Provides `getKey` function for React keys
3. Renders children for each item

---

## Row

Renders a single table row (`<tr>`).

### Props

```tsx
interface RowProps<R> {
  el?: ReactElement;
  children?: ReactNode;
  row?: R;
}
```

#### `el`

**Type:** `ReactElement` (optional)

Custom element to render instead of `<tr>`.

```tsx
<Row el={<tr className="data-row" />} />
```

#### `children`

**Type:** `ReactNode` (optional, defaults to `<Columns />`)

Cell content, typically `<Columns />`.

#### `row`

**Type:** `R` (optional)

Override row data. If omitted, uses data from context (provided by `Rows`).

```tsx
<Row row={{ total: 1000 }}>
  <Columns part="summary" />
</Row>
```

### Default Children

```tsx
// These are equivalent:
<Row />

<Row>
  <Columns />
</Row>
```

### Usage

**In Rows iteration (automatic):**

```tsx
<Rows>
  <Row /> {/* Row data comes from context */}
</Rows>
```

**Standalone with custom data:**

```tsx
<Row row={summaryData}>
  <Columns part="footer" />
</Row>
```

### What It Does

1. Gets row data from context or `row` prop
2. Renders `<tr>` element
3. Provides row data to children via `ContentProvider`

---

## Re-exported Components

These components are re-exported from `@ctablex/core` for convenience:

### DefaultContent

Renders primitive values (string, number, boolean).

```tsx
import { DefaultContent } from '@ctablex/table';

<Column accessor="name">
  <DefaultContent />
</Column>;
```

See [@ctablex/core docs](../../ctablex-core/docs/Contents.md#defaultcontent).

### NullableContent

Handles null/undefined values.

```tsx
import { NullableContent } from '@ctablex/table';

<Column accessor="description">
  <NullableContent nullContent="N/A">
    <DefaultContent />
  </NullableContent>
</Column>;
```

See [@ctablex/core docs](../../ctablex-core/docs/Contents.md#nullablecontent).

### ContentValue

Extracts and provides a value via context (legacy compat component).

```tsx
import { ContentValue } from '@ctablex/table';

<Column header="Full Name">
  <ContentValue accessor="firstName">
    <DefaultContent />
  </ContentValue>{' '}
  <ContentValue accessor="lastName">
    <DefaultContent />
  </ContentValue>
</Column>;
```

**Note:** This is a compatibility component. Prefer using `AccessorContent` or `FieldContent` from `@ctablex/core`.

---

## Related Documentation

- **[OVERVIEW.md](./OVERVIEW.md)** - Getting started guide
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Customization options
- **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)** - Internal architecture
