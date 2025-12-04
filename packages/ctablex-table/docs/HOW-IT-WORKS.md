# How It Works

This document explains the internal architecture and mechanics of **@ctablex/table**. Understanding these concepts will help you understand how the library processes your components and how data flows through the system.

## Table of Contents

- [Column Extraction and Provision](#column-extraction-and-provision)
- [Column Behavior: Definition vs Rendering](#column-behavior-definition-vs-rendering)
- [Component Expansion and Default Children](#component-expansion-and-default-children)
- [Element Rendering System](#element-rendering-system)

---

<!-- first mention that user should read micro context in ctablex/core first -->

<!-- example table here -->

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

  {/* Table expands to its default children */}
  {/* Table renders table */}
  <Table>
  {/* HeaderRow renders tr */}
    <TableHeader>
      {/* Provided part: __HEADER__ by TableHeader */}

      {/* HeaderRow renders tr */}
      <HeaderRow>
        {/* Column render as HeaderCell because __HEADER__ is provided as part context */}
        <Columns>
          {/* HeaderCell renders th */}
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Price</HeaderCell>
        </Columns>
      </HeaderRow>
    </TableHeader>
    {/* Body renders tbody */}
    <TableBody>
      {/* Provided part: __BODY__ by TableBody */}
      {/* Rows iterates over products array and provide each product via context */}
      <Rows>
        {/* Each product is provided via context to Row + render <tr> */}
        <Row>
          <Columns>
            {/* Column render as Cell because __BODY__ is provided as part context */}
            <Cell accessor="name">
              {/* DefaultContent is default children of columns */}
              <DefaultContent />
            </Cell>
            {/* Cell renders td + provide price via context */}
            <Cell accessor="price">
              <NumberContent digits={2} /> dollars
            </Cell>
          </Columns>
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

### DataTable

<!--
data table has two rule.
first extract columns and provide columns via context for children
provide data via content context for children
 -->

When `DataTable` renders, it extracts all `Columns` components from its immediate children:

<!-- it detects columns children by __COLUMNS__ marker -->

**Important:** This is why `Columns` must be **immediate children** of `DataTable`. Columns wrapped in fragments or custom components won't be detected unless those components are marked with `__COLUMNS__ = true`.

The column system is at the heart of ctablex/table. It uses a two-phase approach: **definition** and **rendering**.

### The `__COLUMNS__` Marker

`Columns` components are identified using a static property marker:

```tsx
// In src/columns/columns.tsx
export function Columns(props: ColumnsProps) {
  // ... implementation
}

Columns.__COLUMNS__ = true;
```

This marker allows the library to distinguish `Columns` components from other React elements during the column extraction phase.

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

### ColumnsContext

The extracted columns are provided to the component tree via `ColumnsContext`:

```tsx
// In src/columns/columns-context.tsx
export const ColumnsContext = createContext<ReactNode>(null);

export function useColumns() {
  return useContext(ColumnsContext);
}

export function ColumnsProvider(props: ColumnsProviderProps) {
  return (
    <ColumnsContext.Provider value={props.value}>
      {props.children}
    </ColumnsContext.Provider>
  );
}
```

Any component in the tree can access the extracted column definitions by calling `useColumns()`.

---

## Column Behavior: Definition vs Rendering

`Columns` components behave differently depending on the current "part" context.

### Part Context

The library uses a `PartContext` to track which section of the table is currently rendering:

```tsx
// In src/columns/part-context.tsx
export const PartContext = createContext<string>('');

export function usePart() {
  return useContext(PartContext);
}

export function PartProvider(props: PartProviderProps) {
  return (
    <PartContext.Provider value={props.value}>
      {props.children}
    </PartContext.Provider>
  );
}
```

### Definition Phase

When `DataTable` renders, it sets the part to `DEFINITION_PART`:

```tsx
export const DEFINITION_PART = '__DEFINITION__';

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

This is why you see `Columns` at the top level of `DataTable` but they don't render - they're only used for extraction.

### Rendering Phase

When table components render (e.g., `TableHeader`, `TableBody`), they set different part contexts:

```tsx
// In src/table/table-header.tsx
export const HEADER_PART = '__HEADER__';

export function TableHeader(props: TableHeaderProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.thead, { children });
  return <PartProvider value={HEADER_PART}>{el}</PartProvider>;
}
```

```tsx
// In src/table/table-body.tsx
export const BODY_PART = '__BODY__';

export function TableBody(props: TableBodyProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tbody, { children });
  return <PartProvider value={BODY_PART}>{el}</PartProvider>;
}
```

### Column Rendering by Part

When `<Columns />` or `<Columns part="summary" />` renders in a non-definition context, it filters the extracted columns by part:

```tsx
// In src/columns/utils.ts
export function findColumnsByPart(
  columns: ReactNode,
  part: string | undefined,
): ReactNode {
  return Children.map(columns, (child) => {
    if (isValidElement(child)) {
      if (child.props.part === part) {
        return child.props.children;
      }
    }
    return null;
  });
}
```

This allows different sections of the table to render different column sets:

```tsx
<DataTable data={items}>
  {/* Definition: extracted and stored in context */}
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>

  <Columns part="footer">
    <Column>Total:</Column>
    <Column accessor="total" />
  </Columns>

  <Table>
    <TableBody>
      <Rows>
        <Row>
          {/* Renders main columns (part=undefined) */}
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

### Column Component Dual Behavior

`Column` components also behave differently based on part context:

```tsx
// In src/columns/column.tsx
export function Column<D = any>(props: ColumnProps<D>) {
  const { children = defaultChildren } = props;
  const part = usePart();

  // In header context, render header cell
  if (part === HEADER_PART) {
    return <HeaderCell el={props.thEl}>{props.header}</HeaderCell>;
  }

  // In body/footer context, render data cell
  return (
    <Cell accessor={props.accessor} el={props.el}>
      {children}
    </Cell>
  );
}
```

This single component definition creates both header cells (`<th>`) and data cells (`<td>`) depending on where it's rendered.

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

**First expansion** (Table default children):

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table>
    <TableHeader />
    <TableBody />
  </Table>
</DataTable>
```

**Second expansion** (TableHeader and TableBody default children):

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table>
    <TableHeader>
      <HeaderRow />
    </TableHeader>
    <TableBody>
      <Rows />
    </TableBody>
  </Table>
</DataTable>
```

**Third expansion** (HeaderRow and Rows default children):

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
        <Row />
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

**Fourth expansion** (Row default children):

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
          <Columns />
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

This is the final, fully-expanded structure that actually renders.

---

## Element Rendering System

The element rendering system provides flexibility for customizing HTML elements or swapping in UI library components (like Material-UI).

### TableElements Context

Table elements are provided via context:

```tsx
// In src/elements/table-elements-context.tsx
export const TableElementsContext = createContext<TableElements | undefined>(
  undefined,
);

export function useTableElements() {
  const context = useContext(TableElementsContext);
  return context ?? defaultTableElements;
}

export function TableElementsProvider(props: TableElementsProviderProps) {
  return (
    <TableElementsContext.Provider value={props.value}>
      {props.children}
    </TableElementsContext.Provider>
  );
}
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

The `addProps` utility is crucial for merging props from context elements with children:

```tsx
// In src/utils/add-props.ts
import { cloneElement, ReactElement } from 'react';

export function addProps(el: ReactElement, props: Record<string, any>) {
  return cloneElement(cloneElement(el, props), el.props);
}
```

This function:

1. First clones the element with new props (children)
2. Then clones again with the original props

The result is that:

- Children are added to the element
- Original props from the element are preserved
- Original props take precedence over new props

**Example:**

```tsx
const el = <td className="custom" align="right" />;
const newEl = addProps(el, { children: 'Hello', className: 'default' });
// Result: <td className="custom" align="right">Hello</td>
// Note: className="custom" is preserved, children is added
```

### Customization Patterns

**Pattern 1: Provider for entire table**

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

<TableElementsProvider value={muiElements}>
  <DataTable data={items}>
    <Columns>
      <Column header="Name" accessor="name" />
    </Columns>
    <Table />
  </DataTable>
</TableElementsProvider>;
```

**Pattern 2: Per-component `el` prop**

```tsx
<DataTable data={items}>
  <Columns>
    <Column
      header="Price"
      accessor="price"
      el={<td className="price-cell" />}
      thEl={<th className="price-header" />}
    />
  </Columns>
  <Table el={<table className="custom-table" />}>
    <TableHeader el={<thead className="custom-header" />} />
    <TableBody />
  </Table>
</DataTable>
```

**Pattern 3: Mixed approach**

```tsx
// Use context for most elements
<TableElementsProvider value={muiElements}>
  <DataTable data={items}>
    <Columns>
      {/* Override specific cell */}
      <Column header="Actions" el={<td className="action-cell" />}>
        <button>Edit</button>
      </Column>
    </Columns>
    <Table />
  </DataTable>
</TableElementsProvider>
```

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
