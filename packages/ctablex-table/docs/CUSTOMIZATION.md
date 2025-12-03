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

function CustomCell(props) {
  const Elements = useTableElements();
  const onClick = () => {
    /* handle click */
  };
  // Render using provided td element. only add onClick prop.
  return <Elements.td onClick={onClick}>{props.children}</Elements.td>;
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
<Row el={<tr className="zebra-row" />} />
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
- Conditional styling based on data (inside custom components)
- One-off element modifications

---

## Custom Content Components

Create reusable content renderers that work with the micro-context pattern.

Most table components (like `Column`, `Table`, `Row`) provide sensible default children to reduce boilerplate. However, these defaults are fully customizable—you can replace them with your own content components to control exactly how data is rendered. This flexibility lets you start with simple, working tables and progressively enhance them with custom rendering logic as needed.

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
import { NullableContent, DefaultContent } from '@ctablex/table';
import { KeyContent, ObjectContent } from '@ctablex/core';

<Column accessor="metadata">
  <NullableContent nullContent="No data">
    <ObjectContent join=", ">
      <KeyContent />: <DefaultContent />
    </ObjectContent>
  </NullableContent>
</Column>;
```

### Best Practices

1. **Keep components simple** - One responsibility per component
2. **Use TypeScript** - Type the expected value with `useContent<T>()`
3. **Make them reusable** - Accept props for customization
4. **Handle edge cases** - Null checks, default values

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
  table: <table className="w-full border-collapse" />,
  thead: <thead className="bg-gray-100" />,
  tbody: <tbody className="divide-y divide-gray-200" />,
  tr: <tr className="hover:bg-gray-50" />,
  th: <th className="px-4 py-2 text-left font-medium text-gray-700" />,
  td: <td className="px-4 py-2 text-gray-900" />,
};

<TableElementsProvider value={tailwindElements}>
  <DataTable data={items}>{/* ... */}</DataTable>
</TableElementsProvider>;
```

---

## Advanced Customization

### Heatmap Cell Example

Create a custom cell component that renders a heatmap visualization based on cell values. This example uses `useTableElements` to access the default `td` element and add custom styling:

```tsx
import { useContent, useTableElements } from '@ctablex/table';

interface HeatmapCellProps {
  min?: number;
  max?: number;
  children?: ReactNode;
}

function HeatmapCell({ min = 0, max = 100, children }: HeatmapCellProps) {
  const value = useContent<number>();
  const Elements = useTableElements();

  // Normalize value to 0-1 range
  const intensity = Math.min(Math.max((value - min) / (max - min), 0), 1);

  // Convert intensity to color (blue to red gradient)
  const hue = (1 - intensity) * 240; // 240 (blue) to 0 (red)
  const backgroundColor = `hsl(${hue}, 70%, 50%)`;

  return (
    <Elements.td
      style={{ backgroundColor, color: '#fff', textAlign: 'center' }}
    >
      {children}
    </Elements.td>
  );
}
```

**Usage:**

```tsx
{
  /* Auto-scale from 0 to 100 */
}
{
  /* use <DefaultContent /> as children */
}
<Column header="Score" accessor="score" el={<HeatmapCell />} />;

{
  /* Custom range */
}
<Column header="Price" accessor="price" el={<HeatmapCell min={10} max={50} />}>
  <PriceFormatter />
</Column>;
```

**Key points:**

- Uses `useTableElements()` to get the default `td` element
- Accesses cell value via `useContent<number>()`
- Props passed to the `el` element are accessible in the component
- Children are rendered inside the styled cell

### Selectable Row Example

```tsx
import { useTableElements } from '@ctablex/table';

const defaultChildren = <Columns/>;
function SelectableRow(props) {
  const { children = defaultChildren } = props;
  const content = useContent<{id: string}>();
  const Elements = useTableElements();
  const [selected, setSelected] = useSelectedState(); // get selection state from context
  const onClick = () => {
    setSelected((prev) => (prev === content.id ? null : content.id);
  };
  const isSelected = selected === content.id;
  return <Elements.tr onClick={onClick} className={isSelected ? 'selected' : ''}>{children}</Elements.tr>;
}
```

```tsx
// micro context style selection state management
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  useMemo,
} from 'react';
type SelectState = [
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>,
];
const SelectStateContext = createContext<SelectState | undefined>(undefined);

function useSelectedState() {
  const context = useContext(SelectStateContext);
  if (!context) {
    throw new Error(
      'useSelectedState must be used within a SelectStateProvider',
    );
  }
  return context;
}

function SelectStateProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const state = useMemo(
    () => [selectedId, setSelectedId] as SelectState,
    [selectedId],
  );
  return (
    <SelectStateContext.Provider value={state}>
      {children}
    </SelectStateContext.Provider>
  );
}
```

### Usage

```tsx
<SelectStateProvider>
  <DataTable data={items}>
    <Columns>
      <Column header="Name" accessor="name" />
      <Column header="Price" accessor="price" />
    </Columns>
    <Table>
      <TableHeader />
      <TableBody>
        <Rows>
          <SelectableRow />
        </Rows>
      </TableBody>
    </Table>
  </DataTable>
</SelectStateProvider>
```

## Merging Props

The library uses `addProps` utility internally to merge props:

```tsx
// Internal mechanism
function addProps(el: ReactElement, props: Record<string, any>) {
  return cloneElement(cloneElement(el, props), el.props);
}
```

This allows components to add props (like `children`) while preserving user-provided props (from `el`). props from el has higher priority.

**Your element props always win:**

```tsx
<Column
  accessor="name"
  el={<td className="my-class" />} // Your class is preserved
/>
// Renders: <td className="my-class">content</td>
```

---

## Related Documentation

- **[OVERVIEW.md](./OVERVIEW.md)** - Getting started guide
- **[COMPONENTS.md](./COMPONENTS.md)** - Component API reference
- **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)** - Internal architecture
- **[@ctablex/core - Content Components](../../ctablex-core/docs/Contents.md)** - Core content renderers
