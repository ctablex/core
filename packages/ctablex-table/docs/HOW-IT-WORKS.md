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
  {/* Columns definitions removed by data table */}

  {/* Table expands to default children and renders <table> element */}
  <Table>
    {/* TableHeader sets IsHeaderContext to true and renders <thead> */}
    <TableHeader>
      {/* HeaderRow renders <tr> */}
      <HeaderRow>
        {/* Columns now renders */}
        <Columns>
          {/* Column components detect IsHeaderContext and render as HeaderCell */}
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Price</HeaderCell>
        </Columns>
      </HeaderRow>
    </TableHeader>
    {/* TableBody renders <tbody> */}
    <TableBody>
      {/* Rows iterates over products array, providing each via ContentProvider (using ArrayContent) */}
      <Rows>
        {/* Each product is provided via context to Row + render <tr> */}
        <Row>
          {/* Columns renders again */}
          {/* Column components detect IsHeaderContext is not set and render as Cell */}
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

Now let's go step by step to see how this transformation happens.

**Step 1: DataTable extracts and removes Columns**

DataTable extracts column definitions from its immediate children (those marked with `__COLUMNS__`), provides them via `ColumnsContext`, and removes them from the render tree. After this step, here's what actually renders:

```tsx
<DataTable data={products}>
  {/* Columns with __COLUMNS__ marker removed by DataTable and provided via context */}
  <Table />
</DataTable>
```

**Step 2: Table expands to default children**

Because Table has default children, it expands to TableHeader + TableBody

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader />
    <TableBody />
  </Table>
</DataTable>
```

TableHeader also has default children, it expands to HeaderRow

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>
      <HeaderRow />
    </TableHeader>
    <TableBody />
  </Table>
</DataTable>
```

header row also has default children, it expands to Columns

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
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

columns read columns from context and render them here

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>
      <HeaderRow>
        <Columns>
          <Column header="Name" accessor="name" />
          <Column header="Price" accessor="price">
            <NumberContent digits={2} /> dollars
          </Column>
        </Columns>
      </HeaderRow>
    </TableHeader>
    <TableBody />
  </Table>
</DataTable>
```

TableHeader provides IsHeaderContext (set to true). Column reads IsHeaderContext via useIsHeader() and detects that it is rendering in the header, so it renders HeaderCell

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>
      <HeaderRow>
        <Columns>
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Price</HeaderCell>
        </Columns>
      </HeaderRow>
    </TableHeader>
    <TableBody />
  </Table>
</DataTable>
```

TableBody also has default children, it expands to Rows

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>{/* ...header as before... */}</TableHeader>
    <TableBody>
      <Rows />
    </TableBody>
  </Table>
</DataTable>
```

Rows with the help of ArrayContent iterates over products array, providing each item via ContentProvider

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>{/* ...header as before... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row>{/* each product provided via context */}</Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

you can think of it like this:

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>{/* ...header as before... */}</TableHeader>
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

Row also has default children, it expands to Columns

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>{/* ...header as before... */}</TableHeader>
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

Columns read columns from context and render them here

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>{/* ...header as before... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row>
          <Columns>
            <Column header="Name" accessor="name" />
            <Column header="Price" accessor="price">
              <NumberContent digits={2} /> dollars
            </Column>
          </Columns>
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

Now, Column detects that it is not in the header context, so it renders Cell. DefaultContent is default child of Column, so it renders DefaultContent for name column. For price column, it renders NumberContent as child.

```tsx
<DataTable data={products}>
  {/* Columns removed by DataTable and provided via context */}
  <Table>
    <TableHeader>{/* ...header as before... */}</TableHeader>
    <TableBody>
      <Rows>
        <Row>
          <Columns>
            <Cell accessor="name">
              <DefaultContent />
            </Cell>
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

until now we have seen how the code you write transforms step by step into what actually renders.

## Example Rendering Elements

now see how each component renders the appropriate HTML elements like `<table>`, `<th>`, `<td>`, etc.

In the last example no custom elements were provided, so all components used default HTML elements (e.g. `<table>`, `<th>`, `<td>`). You can also provide custom elements via `TableElementProvider` or `el` props.

```tsx
const elements = {
    table: <table className="fancy-table" />,
    thead: <thead className="fancy-thead" />,
    tbody: <tbody className="fancy-tbody" />,
    tr: <tr className="fancy-tr" />,
    th: <th className="fancy-th" />,
    td: <td className="fancy-td" />,
  }

<TableElementProvider
  value={elements}
>
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

Table will render `<table className="fancy-table">`, because `table` element is provided in context. same for TableHeader, Row in TableHeader, TableBody, HeaderCell and Cell. child props will be added to the elements via `addProps`, preserving original props.

but for price column, `el` and `thEl` props are provided, so those will be used instead of context elements.

for Row, `el` prop is provided, so that will be used instead of context element. `<CustomRow />` will be rendered for each row. it can have access to ContentContext via `useContent` and render customized row based on data.

addProps is double cloning technique that preserves original props of elements while adding new props like children.

```ts
function addProps(el: ReactElement, props: Record<string, any>) {
  return cloneElement(cloneElement(el, props), el.props);
}
```

For example, in `Table` component:

```ts
function Table(props: TableProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  return addProps(props.el ?? elements.table, { children });
}
```

This examples demonstrates the four key systems we'll explore:

1. **Column Extraction**: `Columns` are extracted from DataTable children and stored in context
2. **Part-Based Rendering**: Same `Column` definitions render differently based on context (header vs other)
3. **Default Children**: `<Table />` automatically expands to header + body structure
4. **Element System**: Components render appropriate HTML elements (`<table>`, `<th>`, `<td>`, etc.)

---

## Column Extraction and Provision

The column system uses a two-phase approach: **definition** (extraction) and **rendering**.

### DataTable: Extraction and Context Setup

`DataTable` has three primary responsibilities:

1. **Extract column definitions** from its immediate children
2. **Remove column definitions** from the rendered output
3. **Provide data** via ContentProvider for the entire table

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

<!-- columns context is internal. it is good user know that there is columns context which is provided by data table and consumed by <Columns/> component
useColumns is not public API. so it is better no mention of it
-->

Any component in the tree can access the extracted column definitions by calling `useColumns()`.

## Column Behavior: Extraction and Rendering

`Column` components render differently depending on the `IsHeaderContext`. This dual behavior is what enables the same column definitions to render as headers in `<thead>` and data cells in `<tbody>`.

### Column Extraction

When `DataTable` renders, it extracts and removes `Columns` components:

```tsx
// In src/data-table.tsx
export function DataTable<D>(props: DataTableProps<D>) {
  const { children } = props;
  const data = useContent(props.data);

  // Extract columns marked with __COLUMNS__
  const columns = useMemo(() => findColumns(children), [children]);

  // Get children without the columns
  const otherChildren = useMemo(
    () => findNonColumnsChildren(children),
    [children],
  );

  return (
    <ContentProvider value={data}>
      <ColumnsProvider value={columns}>{otherChildren}</ColumnsProvider>
    </ContentProvider>
  );
}
```

**Key point**: Components marked with `__COLUMNS__` (like `<Columns>`) are extracted from the children and stored in context, then removed from the render tree. They are provided via `ColumnsProvider` and can be rendered later by any `<Columns />` component in the tree.

### Column Rendering

When a `<Columns />` component renders (e.g., inside `HeaderRow` or `Row`), it retrieves the stored columns from context and renders them:

```tsx
// In src/columns/columns.tsx
export function Columns(props: ColumnsProps) {
  const columns = useColumns();
  const { part } = props;

  const partColumns = useMemo(
    () => findColumnsByPart(columns, part),
    [columns, part],
  );

  // Always renders the appropriate columns
  return <>{partColumns}</>;
}
```

**This is the key pattern**: You define `<Columns>` at the top level of `DataTable` (where they're extracted), but they actually render when you place `<Columns />` elsewhere in the tree (like in `HeaderRow` or `Row`).

### IsHeaderContext for Conditional Rendering

The `TableHeader` component provides `IsHeaderContext` to tell `Column` components they should render as header cells:

**TableHeader provides IsHeaderContext:**

```tsx
// In src/table/table-header.tsx
import { IsHeaderProvider } from '../columns/is-header-context';

export function TableHeader(props: TableHeaderProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.thead, { children });

  // Wrap children in IsHeaderProvider (sets IsHeaderContext to true)
  return <IsHeaderProvider>{el}</IsHeaderProvider>;
}
```

**TableBody and TableFooter don't provide IsHeaderContext:**

```tsx
// In src/table/table-body.tsx
export function TableBody(props: TableBodyProps) {
  const { children = defaultChildren } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tbody, { children });
  // No IsHeaderProvider - IsHeaderContext defaults to false
  return el;
}
```

```tsx
// In src/table/table-footer.tsx
export function TableFooter(props: TableFooterProps) {
  const { children } = props;
  const elements = useTableElements();
  const el = addProps(props.el ?? elements.tfoot, { children });
  // No IsHeaderProvider - IsHeaderContext defaults to false
  return el;
}
```

This `IsHeaderContext` is what enables the same `Column` definition to render differently in different sections of the table.

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

The `Column` component checks `IsHeaderContext` and renders differently:

```tsx
// In src/columns/column.tsx
import { useIsHeader } from './is-header-context';

const defaultChildren = <DefaultContent />;

export function Column<D = any>(props: ColumnProps<D>) {
  const { children = defaultChildren } = props;
  const isHeader = useIsHeader();

  // In header context (IsHeaderContext = true), render as a header cell
  if (isHeader) {
    return <HeaderCell el={props.thEl}>{props.header}</HeaderCell>;
  }

  // In body/footer context (IsHeaderContext = false), render as a data cell
  return (
    <Cell accessor={props.accessor} el={props.el}>
      {children}
    </Cell>
  );
}
```

This single component definition creates both:

- **Header cells** (`<th>`) when rendered inside `TableHeader` (IsHeaderContext = true)
- **Data cells** (`<td>`) when rendered in `TableBody` or `TableFooter` (IsHeaderContext = false/undefined)

**Example flow:**

```tsx
<Column header="Name" accessor="name" />

// When rendered inside TableHeader (IsHeaderContext = true):
<HeaderCell el={undefined}>Name</HeaderCell>
// → Renders: <th>Name</th>

// When rendered inside TableBody (IsHeaderContext = false):
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

Now with IsHeaderContext and element rendering:

```tsx
<DataTable data={products}>
  {/* Columns definition extracted and removed from render tree */}

  <table>
    {/* IsHeaderContext = true */}
    <thead>
      <tr>
        {/* Columns renders, Column detects IsHeaderContext = true */}
        <th>Name</th>
        <th>Price</th>
      </tr>
    </thead>

    {/* IsHeaderContext = false (default) */}
    <tbody>
      {/* Rows iterates products, each iteration: */}
      <tr>
        {/* Columns renders, Column detects IsHeaderContext = false */}
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

// In src/elements/table-elements-context.tsx
export const TableElementsContext = createContext<TableElements | undefined>(
  undefined,
);
```

By default, standard HTML elements are used:

```tsx
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

1. **Column Extraction**: `__COLUMNS__` marker + `findColumns` → columns stored in `ColumnsContext` and removed from render tree
2. **Dual Behavior**: `Column` uses `IsHeaderContext` to render as `HeaderCell` (in header) or `Cell` (in body/footer)
3. **Default Children**: Components expand to sensible defaults, reducing boilerplate
4. **Element System**: Context + props + `addProps` = flexible customization

These mechanisms work together to provide a declarative, composable API while maintaining full control over rendering when needed.

## Related Documentation

- **[OVERVIEW.md](./OVERVIEW.md)** - High-level usage patterns
- **[COMPONENTS.md](./COMPONENTS.md)** - Complete API reference
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Customization techniques
- **[@ctablex/core MICRO-CONTEXT.md](../../ctablex-core/docs/MICRO-CONTEXT.md)** - Understanding the micro-context pattern
