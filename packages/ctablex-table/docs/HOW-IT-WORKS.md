# How It Works

This document explains the internal architecture and mechanics of **@ctablex/table**. Understanding these concepts will help you understand how the library processes your components and how data flows through the system.

## Prerequisites

Before diving into this document, you should understand the **micro-context pattern** that powers ctablex. Read **[@ctablex/core MICRO-CONTEXT.md](../../ctablex-core/docs/MICRO-CONTEXT.md)** to learn about:

- How context flows data through component hierarchies
- The `ContentProvider` and `useContent` pattern
- Why this approach enables composable, decoupled components

This foundation is essential for understanding how ctablex/table works.

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [Column Extraction and Provision](#column-extraction-and-provision)
- [Column Behavior: Definition vs Rendering](#column-behavior-definition-vs-rendering)
- [Component Expansion and Default Children](#component-expansion-and-default-children)
- [Element Rendering System](#element-rendering-system)

---

## High-Level Overview

Let's start with a concrete example showing the transformation from what you write to what actually renders.

**What you write:**

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price">
      <NumberContent digits={2} /> dollars
    </Column>
  </Columns>
  <Table />
</DataTable>
```

**What actually renders:**

```tsx
<DataTable data={products}>
  {/* Provided part: __DEFINITION__ */}
  {/* Columns definitions don't render during the definition phase */}
  {null}

  {/* Table expands to default children and renders <table> element */}
  <Table>
    {/* TableHeader sets part context: HEADER_PART and renders <thead> */}
    <TableHeader>
      {/* HeaderRow renders <tr> */}
      <HeaderRow>
        {/* Columns now renders because we're in HEADER_PART */}
        <Columns>
          {/* Column components detect HEADER_PART and render as HeaderCell */}
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Price</HeaderCell>
        </Columns>
      </HeaderRow>
    </TableHeader>
    {/* TableBody sets part context: BODY_PART and renders <tbody> */}
    <TableBody>
      {/* Rows iterates over products array, providing each via ContentProvider */}
      <Rows>
        {/* Each product is provided via context to Row + render <tr> */}
        <Row>
          {/* Columns renders again, but in BODY_PART context */}
          {/* Column components detect BODY_PART and render as Cell */}
          <Columns>
            {/* Cell extracts "name" field and provides it via ContentProvider */}
            <Cell accessor="name">
              {/* DefaultContent is the default child of Column */}
              <DefaultContent />
            </Cell>
            {/* Cell extracts "price" field and provides it via ContentProvider */}
            <Cell accessor="price">
              {/* NumberContent gets value from content context and formats the price */}
              <NumberContent digits={2} /> dollars
            </Cell>
          </Columns>
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

This example demonstrates the four key systems we'll explore:

1. **Column Extraction**: `Columns` are extracted from DataTable children and stored in context
2. **Part-Based Rendering**: Same `Column` definitions render differently based on context (header vs body)
3. **Default Children**: `<Table />` automatically expands to header + body structure
4. **Element System**: Components render appropriate HTML elements (`<table>`, `<th>`, `<td>`, etc.)

---

## Column Extraction and Provision

The column system uses a two-phase approach: **definition** (extraction) and **rendering**.

### DataTable: Extraction and Context Setup

`DataTable` has two primary responsibilities:

1. **Extract column definitions** from its immediate children
2. **Provide data** via ContentProvider for the entire table

### The `__COLUMNS__` Marker

Columns are detected using a static property marker. This allows `DataTable` to identify `Columns` components during extraction:

```tsx
// In src/columns/columns.tsx
export function Columns(props: ColumnsProps) {
  // ... implementation
}

// Static marker for identification
Columns.__COLUMNS__ = true;
```

The type checking is done via:

```tsx
// In src/columns/types.ts
export interface ColumnsType {
  __COLUMNS__: true;
}

export function isColumnsType(type: any): type is ColumnsType {
  return Boolean(type && type.__COLUMNS__);
}
```

The `findColumns` utility uses this marker to extract only `Columns` components:

```tsx
// In src/columns/utils.ts
export function findColumns(children: ReactNode): ReactNode {
  return Children.map(children, (child): ReactNode => {
    if (isValidElement(child) && isColumnsType(child.type)) {
      return child;
    }
    return null;
  });
}
```

**Important:** This is why `Columns` must be **immediate children** of `DataTable`. Columns wrapped in fragments or custom components won't be detected unless those components are marked with `__COLUMNS__ = true`.

**Examples:**

```tsx
// ✓ OK - Columns is immediate child
<DataTable data={items}>
  <Columns>
    <Column header="Name" accessor="name" />
  </Columns>
  <Table />
</DataTable>

// ✗ NOT OK - Columns wrapped in fragment
<DataTable data={items}>
  <>
    <Columns>
      <Column header="Name" accessor="name" />
    </Columns>
  </>
  <Table />
</DataTable>

// ✗ NOT OK - Columns wrapped in custom component (unless marked)
<DataTable data={items}>
  <MyColumns /> {/* Won't be detected */}
  <Table />
</DataTable>

// ✓ OK - Custom wrapper marked with __COLUMNS__
function MyColumns() {
  return (
    <Columns>
      <Column header="Name" accessor="name" />
    </Columns>
  );
}
MyColumns.__COLUMNS__ = true; // Mark as column container

<DataTable data={items}>
  <MyColumns /> {/* Now works! */}
  <Table />
</DataTable>
```

### ColumnsContext

The extracted columns are provided to the component tree via `ColumnsContext`:

Any component in the tree can access the extracted column definitions by calling `useColumns()`.

## Column Behavior: Definition vs Rendering

`Columns` components behave differently depending on the current "part" context. This dual behavior is what enables the same column definitions to render as headers in `<thead>` and data cells in `<tbody>`.

### Part Context System

The library uses `PartContext` to track which section of the table is currently rendering:

### Definition Phase

When `DataTable` renders, it sets the part to `DEFINITION_PART`:

```tsx
// In src/data-table.tsx
export const DEFINITION_PART = '__DEFINITION__';

// DataTable wraps children in DEFINITION_PART context
<PartProvider value={DEFINITION_PART}>
  <ColumnsProvider value={columns}>{children}</ColumnsProvider>
</PartProvider>;
```

During this phase, `Columns` components return `null` to prevent rendering:

```tsx
// In src/columns/columns.tsx
export function Columns(props: ColumnsProps) {
  const currentPart = usePart();
  const columns = useColumns();
  const { part } = props;

  const partColumns = useMemo(
    () => findColumnsByPart(columns, part),
    [columns, part],
  );

  // During definition phase, don't render anything
  if (currentPart === DEFINITION_PART) {
    return null;
  }

  // During rendering phase, render the appropriate columns
  return <>{partColumns}</>;
}
```

**This is crucial**: You see `<Columns>` at the top level of `DataTable`, but they don't render. They're only used for extraction and storage in context. The actual rendering happens later when components like `TableHeader` and `TableBody` request them.

### Rendering Phase

When table components render (e.g., `TableHeader`, `TableBody`), they set different part contexts. This tells `Column` components how to render themselves.

**TableHeader sets `HEADER_PART`:**

```tsx
// In src/table/table-header.tsx
export const HEADER_PART = '__HEADER__';

export function TableHeader(props: TableHeaderProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.thead, { children });

  // Wrap children in HEADER_PART context
  return <PartProvider value={HEADER_PART}>{el}</PartProvider>;
}
```

**TableBody sets `BODY_PART`:**

```tsx
// In src/table/table-body.tsx
export const BODY_PART = '__BODY__';

export function TableBody(props: TableBodyProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tbody, { children });

  // Wrap children in BODY_PART context
  return <PartProvider value={BODY_PART}>{el}</PartProvider>;
}
```

**TableFooter sets `FOOTER_PART`:**

```tsx
// In src/table/table-footer.tsx
export const FOOTER_PART = '__FOOTER__';

export function TableFooter(props: TableFooterProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tfoot, { children });

  // Wrap children in FOOTER_PART context
  return <PartProvider value={FOOTER_PART}>{el}</PartProvider>;
}
```

These part contexts are what enable the same `Column` definition to render differently in different sections of the table.

### Column Rendering by Part

When `<Columns />` or `<Columns part="summary" />` renders in a non-definition context, it filters the extracted columns by the `part` prop:

```tsx
// In src/columns/utils.ts
export function findColumnsByPart(
  columns: ReactNode,
  part: string | undefined,
): ReactNode {
  return Children.map(columns, (child) => {
    if (isValidElement(child)) {
      // Match columns by part prop
      if (child.props.part === part) {
        return child.props.children;
      }
    }
    return null;
  });
}
```

This allows different sections of the table to render different column sets - perfect for summary rows, footers, or multi-part tables:

```tsx
<DataTable data={items}>
  {/* Default columns (part=undefined) */}
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>

  {/* Footer columns (part="footer") */}
  <Columns part="footer">
    <Column>Total:</Column>
    <Column accessor="total">
      <NumberContent />
    </Column>
  </Columns>

  <Table>
    <TableBody>
      <Rows>
        <Row>
          {/* Renders default columns (part=undefined) */}
          <Columns />
        </Row>
      </Rows>
    </TableBody>
    <TableFooter>
      <Row row={summaryData}>
        {/* Renders footer columns (part="footer") */}
        <Columns part="footer" />
      </Row>
    </TableFooter>
  </Table>
</DataTable>
```

**How it works:**

1. DataTable extracts **all** `Columns` (both default and `part="footer"`)
2. `<Columns />` in the body row renders only columns with `part=undefined`
3. `<Columns part="footer" />` in the footer row renders only columns with `part="footer"`
4. Each renders the appropriate cell structure for its section

### Column Component Dual Behavior

The `Column` component is smart - it checks the current part context and renders differently:

```tsx
// In src/columns/column.tsx
const defaultChildren = <DefaultContent />;

export function Column<D = any>(props: ColumnProps<D>) {
  const { children = defaultChildren } = props;
  const part = usePart();

  // In HEADER_PART context, render as a header cell
  if (part === HEADER_PART) {
    return <HeaderCell el={props.thEl}>{props.header}</HeaderCell>;
  }

  // In BODY_PART or FOOTER_PART context, render as a data cell
  return (
    <Cell accessor={props.accessor} el={props.el}>
      {children}
    </Cell>
  );
}
```

This single component definition creates both:

- **Header cells** (`<th>`) when rendered in `TableHeader`
- **Data cells** (`<td>`) when rendered in `TableBody` or `TableFooter`

**Example flow:**

```tsx
<Column header="Name" accessor="name" />

// When rendered in TableHeader (HEADER_PART):
<HeaderCell el={undefined}>Name</HeaderCell>
// → Renders: <th>Name</th>

// When rendered in TableBody (BODY_PART):
<Cell accessor="name">
  <DefaultContent />
</Cell>
// → Renders: <td>{extractedValue}</td>
```

---

## Component Expansion and Default Children

Most components in ctablex/table have sensible default children, reducing boilerplate and making the API more ergonomic.

### Table Component

The `Table` component defaults to rendering a header and body:

```tsx
// In src/table/table.tsx
const defaultChildren = (
  <>
    <TableHeader />
    <TableBody />
  </>
);

export function Table(props: TableProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  return addProps(props.el ?? elements.table, { children });
}
```

So these are equivalent:

```tsx
<Table />

// Expands to:
<Table>
  <TableHeader />
  <TableBody />
</Table>
```

### TableHeader Component

The `TableHeader` defaults to a single header row:

```tsx
// In src/table/table-header.tsx
const defaultChildren = <HeaderRow />;

export function TableHeader(props: TableHeaderProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.thead, { children });
  return <PartProvider value={HEADER_PART}>{el}</PartProvider>;
}
```

Equivalence:

```tsx
<TableHeader />

// Expands to:
<TableHeader>
  <HeaderRow />
</TableHeader>
```

### TableBody Component

The `TableBody` defaults to iterating rows:

```tsx
// In src/table/table-body.tsx
const defaultChildren = <Rows />;

export function TableBody(props: TableBodyProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tbody, { children });
  return <PartProvider value={BODY_PART}>{el}</PartProvider>;
}
```

Equivalence:

```tsx
<TableBody />

// Expands to:
<TableBody>
  <Rows />
</TableBody>
```

### Rows Component

The `Rows` component defaults to rendering a single `Row` for each data item:

```tsx
// In src/table/rows.tsx
const defaultChildren = <Row />;

export function Rows<D>(props: RowsProps<D>) {
  const keyAccessor = props.keyAccessor;
  const { children = defaultChildren } = props;
  const getKey = useCallback(
    (data: D, index: number): number | string => {
      if (!keyAccessor) {
        return index;
      }
      return accessTo(data, keyAccessor);
    },
    [keyAccessor],
  );
  return (
    <ArrayContent value={props.rows} getKey={getKey}>
      {children}
    </ArrayContent>
  );
}
```

`ArrayContent` (from @ctablex/core) iterates over the data array and renders children for each item.

Equivalence:

```tsx
<Rows />

// Expands to:
<Rows>
  <Row />
</Rows>
```

### Row Component

The `Row` defaults to rendering columns:

```tsx
// In src/table/row.tsx
const defaultChildren = <Columns />;

export function Row<R>(props: RowProps<R>) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const row = useContent(props.row);
  const el = addProps(props.el ?? elements.tr, { children });
  return <ContentProvider value={row}>{el}</ContentProvider>;
}
```

Equivalence:

```tsx
<Row />

// Expands to:
<Row>
  <Columns />
</Row>
```

### HeaderRow Component

Similarly, `HeaderRow` defaults to columns:

```tsx
// In src/table/header-row.tsx
const defaultChildren = <Columns />;

export function HeaderRow(props: TableProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  return addProps(props.el ?? elements.tr, { children });
}
```

### Full Expansion Example

Starting with this minimal code:

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table />
</DataTable>
```

Let's see how it expands step by step:

**Step 1: Table expands to default children**

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table>
    {/* Table defaults expanded: */}
    <TableHeader />
    <TableBody />
  </Table>
</DataTable>
```

**Step 2: TableHeader and TableBody expand**

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table>
    <TableHeader>
      {/* TableHeader default: */}
      <HeaderRow />
    </TableHeader>
    <TableBody>
      {/* TableBody default: */}
      <Rows />
    </TableBody>
  </Table>
</DataTable>
```

**Step 3: HeaderRow and Rows expand**

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table>
    <TableHeader>
      <HeaderRow>
        {/* HeaderRow default: */}
        <Columns />
      </HeaderRow>
    </TableHeader>
    <TableBody>
      <Rows>
        {/* Rows default: */}
        <Row />
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

**Step 4: Row expands**

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table>
    <TableHeader>
      <HeaderRow>
        <Columns />
      </HeaderRow>
    </TableHeader>
    <TableBody>
      <Rows>
        <Row>
          {/* Row default: */}
          <Columns />
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

**Final: What actually executes**

Now with part contexts and element rendering:

```tsx
<DataTable data={products}>
  {/* Part: DEFINITION_PART - Columns returns null */}

  <table>
    {/* Part: HEADER_PART */}
    <thead>
      <tr>
        {/* Columns renders, Column detects HEADER_PART */}
        <th>Name</th>
        <th>Price</th>
      </tr>
    </thead>

    {/* Part: BODY_PART */}
    <tbody>
      {/* Rows iterates products, each iteration: */}
      <tr>
        {/* Columns renders, Column detects BODY_PART */}
        <td>{name value}</td>
        <td>{price value}</td>
      </tr>
    </tbody>
  </table>
</DataTable>
```

This is the complete transformation from your concise code to what actually renders!

---

## Element Rendering System

The element rendering system provides flexibility for customizing HTML elements or swapping in UI library components (like Material-UI). It uses a priority-based resolution system.

### How Elements Are Resolved

When a component needs to render an element, it follows this priority order:

1. **`el` prop** (highest priority) - Explicitly passed element
2. **Element from context** - Provided by `TableElementsProvider`
3. **Default element** (lowest priority) - Standard HTML element

**Example in the `Table` component:**

```tsx
// In src/table/table.tsx
export function Table(props: TableProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements(); // Get elements from context

  // Priority: props.el > context element > default
  return addProps(props.el ?? elements.table, { children });
}
```

**Example in the `Cell` component:**

```tsx
// In src/table/cell.tsx
export function Cell<D>(props: CellProps<D>) {
  const content = useContent<D>();
  const contextEl = useTableElements(); // Get elements from context
  const { accessor, children } = props;

  // Priority: props.el > context element (td)
  const el = addProps(props.el ?? contextEl.td, { children });

  if (accessor === undefined) {
    return el;
  }
  const value = access(content, accessor);
  return <ContentProvider value={value}>{el}</ContentProvider>;
}
```

### TableElements Context

Table elements are provided via context:

```tsx
// In src/elements/table-elements-context.tsx
export const TableElementsContext = createContext<TableElements | undefined>(
  undefined,
);

```

### Default Elements

By default, standard HTML elements are used:

```tsx
// In src/elements/table-elements.tsx
export interface TableElements {
  table: ReactElement;
  thead: ReactElement;
  tbody: ReactElement;
  tfoot: ReactElement;
  tr: ReactElement;
  th: ReactElement;
  td: ReactElement;
}

export const defaultTableElements: TableElements = {
  table: <table />,
  thead: <thead />,
  tbody: <tbody />,
  tfoot: <tfoot />,
  tr: <tr />,
  th: <th />,
  td: <td />,
};
```

### Element Resolution: Context vs Props

When a component needs to render an element, it follows this priority:

1. **`el` prop** (highest priority)
2. **Element from context**
3. **Default element** (lowest priority)

This is implemented in every component. For example, in `Table`:

```tsx
export function Table(props: TableProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();

  // Prefer el prop, fall back to context element
  return addProps(props.el ?? elements.table, { children });
}
```

Similarly in `Cell`:

```tsx
export function Cell<D>(props: CellProps<D>) {
  const content = useContent<D>();
  const contextEl = useTableElements();
  const { accessor, children } = props;

  // Prefer el prop, fall back to context element (td)
  const el = addProps(props.el ?? contextEl.td, { children });

  if (accessor === undefined) {
    return el;
  }
  const value = access(content, accessor);
  return <ContentProvider value={value}>{el}</ContentProvider>;
}
```

### Props Merging with addProps

The `addProps` utility is crucial for merging props. It ensures that:

- New props (like children) are added to the element
- Original props from the element are preserved
- **Original props take precedence** over new props

```tsx
// In src/utils/add-props.ts
import { cloneElement, ReactElement } from 'react';

export function addProps(el: ReactElement, props: Record<string, any>) {
  // Clone twice: first with new props, then with original props
  return cloneElement(cloneElement(el, props), el.props);
}
```

**How it works:**

1. **First `cloneElement`**: Clones element with new props (e.g., `children`)
2. **Second `cloneElement`**: Clones again with original props, which override the new ones

**Example:**

```tsx
const el = <td className="custom" align="right" />;
const newEl = addProps(el, {
  children: 'Hello',
  className: 'default', // This will be overridden
});

// Result: <td className="custom" align="right">Hello</td>
// ✓ className="custom" is preserved (original wins)
// ✓ children="Hello" is added (new value)
// ✗ className="default" is ignored (original takes precedence)
```

**Why this matters:**

This allows you to provide elements with custom props in context or as `el` props, and those props are preserved even when the library adds children or other props internally.

```tsx
// Context element with custom props
const muiElements = {
  td: <TableCell align="right" sx={{ fontWeight: 'bold' }} />,
};

<TableElementsProvider value={muiElements}>
  <DataTable data={items}>
    <Columns>
      <Column accessor="price">
        {/* The td will render as: */}
        {/* <TableCell align="right" sx={{ fontWeight: 'bold' }}>...</TableCell> */}
        <NumberContent />
      </Column>
    </Columns>
    <Table />
  </DataTable>
</TableElementsProvider>;
```

### Customization Patterns

There are three main ways to customize elements:

**Pattern 1: Provider for entire table (global customization)**

Use `TableElementsProvider` to apply custom elements to all tables within:

```tsx
import { TableElementsProvider } from '@ctablex/table';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

const muiElements = {
  table: <Table />,
  thead: <TableHead />,
  tbody: <TableBody />,
  tfoot: <TableBody />,
  tr: <TableRow />,
  th: <TableCell />,
  td: <TableCell />,
};

function App() {
  return (
    <TableElementsProvider value={muiElements}>
      <DataTable data={items}>
        <Columns>
          <Column header="Name" accessor="name" />
        </Columns>
        <Table />
      </DataTable>
    </TableElementsProvider>
  );
}
```

**Pattern 2: Per-component `el` prop (targeted customization)**

Override specific elements using the `el` prop:

```tsx
<DataTable data={items}>
  <Columns>
    <Column
      header="Price"
      accessor="price"
      el={<td className="price-cell" style={{ textAlign: 'right' }} />}
      thEl={<th className="price-header" />}
    />
  </Columns>
  <Table el={<table className="custom-table" />}>
    <TableHeader el={<thead className="custom-header" />} />
    <TableBody />
  </Table>
</DataTable>
```

**Pattern 3: Mixed approach (context + selective overrides)**

Use context for most elements, but override specific ones:

```tsx
<TableElementsProvider value={muiElements}>
  <DataTable data={items}>
    <Columns>
      {/* Most cells use Material-UI from context */}
      <Column header="Name" accessor="name" />
      <Column header="Price" accessor="price" />

      {/* This one gets special styling */}
      <Column
        header="Actions"
        el={<td className="action-cell" style={{ padding: '16px' }} />}
      >
        <button>Edit</button>
      </Column>
    </Columns>
    <Table />
  </DataTable>
</TableElementsProvider>
```

This mixed approach gives you the best of both worlds: global consistency with targeted customization where needed.

### Element Flow Summary

1. **Context Elements** are defined via `TableElementsProvider`
2. **Components** read elements using `useTableElements()`
3. **Props** can override elements with `el` prop
4. **addProps** merges children while preserving original props
5. **Final element** renders with merged props and children

---

## Summary

Understanding these four key systems helps you leverage the full power of ctablex/table:

1. **Column Extraction**: `__COLUMNS__` marker + `findColumns` → `ColumnsContext`
2. **Dual Behavior**: `DEFINITION_PART` (extraction) vs rendering parts (header/body/footer)
3. **Default Children**: Components expand to sensible defaults, reducing boilerplate
4. **Element System**: Context + props + `addProps` = flexible customization

These mechanisms work together to provide a declarative, composable API while maintaining full control over rendering when needed.

## Related Documentation

- **[OVERVIEW.md](./OVERVIEW.md)** - High-level usage patterns
- **[COMPONENTS.md](./COMPONENTS.md)** - Complete API reference
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Customization techniques
- **[@ctablex/core MICRO-CONTEXT.md](../../ctablex-core/docs/MICRO-CONTEXT.md)** - Understanding the micro-context pattern
