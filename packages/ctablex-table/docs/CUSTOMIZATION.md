# Customization Guide

Learn how to customize table rendering in **@ctablex/table**.

## Table of Contents

- [Element Customization](#element-customization)
- [TableElementsProvider](#tableelemementsprovider)
- [Per-Component `el` Props](#per-component-el-props)
- [Custom Content Components](#custom-content-components)
- [Styling Approaches](#styling-approaches)
- [Advanced Customization](#advanced-customization)

---

## Element Customization

**@ctablex/table** provides two ways to customize HTML elements:

1. **`TableElementsProvider`** - Global element defaults for the table
2. **`el` prop** - Per-component element override

Both approaches use the same mechanism: replacing default elements with custom ones.

---

## TableElementsProvider

Provides custom HTML elements for all table parts globally.

### Usage

```tsx
import {
  DataTable,
  Columns,
  Column,
  Table,
  TableElementsProvider,
  TableElements,
} from '@ctablex/table';

const customElements: TableElements = {
  table: <table className="custom-table" />,
  thead: <thead className="custom-thead" />,
  tbody: <tbody className="custom-tbody" />,
  tfoot: <tfoot className="custom-tfoot" />,
  tr: <tr className="custom-row" />,
  th: <th className="custom-header-cell" />,
  td: <td className="custom-data-cell" />,
};

function App() {
  return (
    <TableElementsProvider value={customElements}>
      <DataTable data={items}>
        <Columns>
          <Column header="Name" accessor="name" />
          <Column header="Price" accessor="price" />
        </Columns>
        <Table />
      </DataTable>
    </TableElementsProvider>
  );
}
```

### TableElements Type

```tsx
interface TableElements {
  table: ReactElement; // <table>
  thead: ReactElement; // <thead>
  tbody: ReactElement; // <tbody>
  tfoot: ReactElement; // <tfoot>
  tr: ReactElement; // <tr>
  th: ReactElement; // <th>
  td: ReactElement; // <td>
}
```

All elements must be provided. Use `defaultTableElements` as a base:

```tsx
import { defaultTableElements } from '@ctablex/table';

const customElements: TableElements = {
  ...defaultTableElements,
  table: <table className="my-table" />,
  td: <td className="my-cell" />,
};
```

### useTableElements Hook

Access the current table elements from context:

```tsx
import { useTableElements } from '@ctablex/table';

function CustomCell() {
  const elements = useTableElements();
  // elements.td, elements.tr, etc.
  return <div>Custom cell</div>;
}
```

### When to Use

Use `TableElementsProvider` when:

- Applying consistent styles across all tables
- Using a UI library (Material-UI, Ant Design, etc.)
- Need global element customization

---

## Per-Component `el` Props

Override elements for specific component instances.

### Available `el` Props

| Component   | Prop   | Element   | Description        |
| ----------- | ------ | --------- | ------------------ |
| Table       | `el`   | `<table>` | Main table element |
| TableHeader | `el`   | `<thead>` | Header section     |
| TableBody   | `el`   | `<tbody>` | Body section       |
| TableFooter | `el`   | `<tfoot>` | Footer section     |
| Row         | `el`   | `<tr>`    | Table row          |
| Column      | `el`   | `<td>`    | Data cell          |
| Column      | `thEl` | `<th>`    | Header cell        |

### Examples

**Custom table class:**

```tsx
<Table el={<table className="data-table" />} />
```

**Styled row:**

```tsx
<Row el={<tr className="highlight-row" />} />
```

**Column with alignment:**

```tsx
<Column
  header="Price"
  accessor="price"
  el={<td align="right" />}
  thEl={<th align="right" />}
/>
```

**Conditional styling:**

```tsx
<Row el={<tr className={item.isActive ? 'active' : 'inactive'} />} />
```

### Priority

`el` props override `TableElementsProvider`:

```tsx
<TableElementsProvider value={{ td: <td className="default" /> }}>
  <Column
    accessor="name"
    el={<td className="override" />}  {/* This wins */}
  />
</TableElementsProvider>
```

### When to Use

Use `el` props when:

- Customizing specific components
- Conditional styling based on data
- One-off element modifications

---

## Custom Content Components

Create reusable content renderers that work with the micro-context pattern.

### Basic Pattern

Custom components use `useContent` to access values from context:

```tsx
import { useContent } from '@ctablex/core';

function PriceFormatter() {
  const price = useContent<number>();
  return <span className="price">${price.toFixed(2)}</span>;
}

// Usage
<Column accessor="price">
  <PriceFormatter />
</Column>;
```

### With Props

Content components can accept props for customization:

```tsx
interface NumberFormatterProps {
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function NumberFormatter({
  decimals = 0,
  prefix = '',
  suffix = ''
}: NumberFormatterProps) {
  const value = useContent<number>();
  return (
    <span>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// Usage
<Column accessor="price">
  <NumberFormatter decimals={2} prefix="$" />
</Column>

<Column accessor="weight">
  <NumberFormatter decimals={1} suffix=" kg" />
</Column>
```

### Boolean Content

```tsx
interface BooleanContentProps {
  yes: ReactNode;
  no: ReactNode;
}

function BooleanContent({ yes, no }: BooleanContentProps) {
  const value = useContent<boolean>();
  return <>{value ? yes : no}</>;
}

// Usage
<Column accessor="inStock">
  <BooleanContent yes="✓" no="✗" />
</Column>

<Column accessor="isActive">
  <BooleanContent
    yes={<span className="active">Active</span>}
    no={<span className="inactive">Inactive</span>}
  />
</Column>
```

### Date Formatter

```tsx
interface DateFormatterProps {
  format?: 'short' | 'long';
}

function DateFormatter({ format = 'short' }: DateFormatterProps) {
  const date = useContent<Date>();

  const formatted =
    format === 'short' ? date.toLocaleDateString() : date.toLocaleString();

  return <time dateTime={date.toISOString()}>{formatted}</time>;
}

// Usage
<Column accessor="createdAt">
  <DateFormatter format="long" />
</Column>;
```

### Nullable Content

```tsx
import { NullableContent, DefaultContent } from '@ctablex/table';

<Column accessor="optionalField">
  <NullableContent nullContent="—">
    <DefaultContent />
  </NullableContent>
</Column>;
```

### Composing Content

Content components can be composed:

```tsx
<Column accessor="metadata">
  <NullableContent nullContent="No data">
    <ObjectContent>
      <KeyContent />: <DefaultContent />
    </ObjectContent>
  </NullableContent>
</Column>
```

### Best Practices

1. **Keep components simple** - One responsibility per component
2. **Use TypeScript** - Type the expected value with `useContent<T>()`
3. **Make them reusable** - Accept props for customization
4. **Handle edge cases** - Null checks, default values
5. **Memoize when needed** - Use `useMemo` for expensive rendering

---

## Styling Approaches

### CSS Classes

**Via `el` props:**

```tsx
<Table el={<table className="data-table" />}>
  <TableHeader el={<thead className="table-header" />} />
  <TableBody el={<tbody className="table-body" />} />
</Table>
```

**Via `TableElementsProvider`:**

```tsx
const styledElements: TableElements = {
  ...defaultTableElements,
  table: <table className="table table-striped" />,
  th: <th className="header-cell" />,
  td: <td className="data-cell" />,
};

<TableElementsProvider value={styledElements}>
  <DataTable data={items}>{/* ... */}</DataTable>
</TableElementsProvider>;
```

### Inline Styles

```tsx
<Column
  accessor="price"
  el={<td style={{ textAlign: 'right', fontWeight: 'bold' }} />}
/>
```

### CSS-in-JS (Styled Components)

```tsx
import styled from 'styled-components';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTd = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

const styledElements: TableElements = {
  ...defaultTableElements,
  table: <StyledTable />,
  td: <StyledTd />,
};

<TableElementsProvider value={styledElements}>
  <DataTable data={items}>{/* ... */}</DataTable>
</TableElementsProvider>;
```

### Material-UI Integration

```tsx
import {
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  Paper,
} from '@mui/material';

const muiElements: TableElements = {
  table: <MuiTable />,
  thead: <MuiTableHead />,
  tbody: <MuiTableBody />,
  tfoot: <MuiTableHead />, // or custom footer
  tr: <MuiTableRow />,
  th: <MuiTableCell />,
  td: <MuiTableCell />,
};

function MuiTableProvider({ children }: { children: ReactNode }) {
  return (
    <TableElementsProvider value={muiElements}>
      {children}
    </TableElementsProvider>
  );
}

// Usage
<MuiTableProvider>
  <Paper>
    <DataTable data={items}>
      <Columns>
        <Column header="Name" accessor="name" />
        <Column header="Price" accessor="price" />
      </Columns>
      <Table />
    </DataTable>
  </Paper>
</MuiTableProvider>;
```

### Tailwind CSS

```tsx
const tailwindElements: TableElements = {
  ...defaultTableElements,
  table: <table className="min-w-full divide-y divide-gray-200" />,
  thead: <thead className="bg-gray-50" />,
  tbody: <tbody className="bg-white divide-y divide-gray-200" />,
  tr: <tr className="hover:bg-gray-50" />,
  th: (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
  ),
  td: <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" />,
};

<TableElementsProvider value={tailwindElements}>
  <DataTable data={items}>{/* ... */}</DataTable>
</TableElementsProvider>;
```

---

## Advanced Customization

### Conditional Row Styling

```tsx
<Rows>
  <Row>
    {(row) => (
      <Row el={<tr className={row.isActive ? 'active' : 'inactive'} />}>
        <Columns />
      </Row>
    )}
  </Row>
</Rows>
```

**Better approach** - Custom Row component:

```tsx
function ConditionalRow() {
  const row = useContent<Item>();
  return (
    <Row el={<tr className={row.isActive ? 'active' : 'inactive'} />}>
      <Columns />
    </Row>
  );
}

<Rows>
  <ConditionalRow />
</Rows>;
```

### Custom Cell Wrappers

```tsx
function ClickableCell({ onClick }: { onClick: () => void }) {
  const value = useContent();
  return (
    <td onClick={onClick} style={{ cursor: 'pointer' }}>
      {value}
    </td>
  );
}

// Direct usage (not via Column)
<Row>
  <ClickableCell onClick={() => alert('Clicked')} />
</Row>;
```

### Merging Props

The library uses `addProps` utility internally to merge props:

```tsx
// Internal mechanism
function addProps(el: ReactElement, props: Record<string, any>) {
  return cloneElement(cloneElement(el, props), el.props);
}
```

This allows components to add props (like `children`) while preserving user-provided props (from `el`).

**Your element props always win:**

```tsx
<Column
  accessor="name"
  el={<td className="my-class" />} // Your class is preserved
/>
// Renders: <td className="my-class">content</td>
```

### Building Your Own Table Component

Create a wrapper that provides custom elements by default:

```tsx
import {
  DataTable as BaseDataTable,
  DataTableProps,
  TableElementsProvider,
  defaultTableElements,
} from '@ctablex/table';

const myElements: TableElements = {
  ...defaultTableElements,
  table: <table className="my-app-table" />,
  td: <td className="my-app-cell" />,
};

export function DataTable<D>(props: DataTableProps<D>) {
  return (
    <TableElementsProvider value={myElements}>
      <BaseDataTable {...props} />
    </TableElementsProvider>
  );
}

// Now all tables use your elements
<DataTable data={items}>
  <Columns>
    <Column header="Name" accessor="name" />
  </Columns>
  <Table />
</DataTable>;
```

---

## Related Documentation

- **[OVERVIEW.md](./OVERVIEW.md)** - Getting started guide
- **[COMPONENTS.md](./COMPONENTS.md)** - Component API reference
- **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)** - Internal architecture
- **[@ctablex/core - Content Components](../../ctablex-core/docs/Contents.md)** - Core content renderers
