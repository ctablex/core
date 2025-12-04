# How It Works

Deep dive into the internal architecture of **@ctablex/table**.

## Table of Contents

- [Key Concepts](#key-concepts)
- [Three-Context System](#three-context-system)
- [Rendering Phases](#rendering-phases)
- [Part-Based Rendering](#part-based-rendering)
- [Column Extraction](#column-extraction)
- [Data Flow](#data-flow)
- [Component Lifecycle](#component-lifecycle)
- [Performance Considerations](#performance-considerations)

---

## Key Concepts

To understand **@ctablex/table**, you should know these fundamental concepts:

### 1. Column Extraction and Provision by DataTable

**DataTable** is responsible for finding and storing column definitions:

```tsx
export function DataTable<D>(props: DataTableProps<D>) {
  const { children } = props;
  
  // Extract columns from children
  const columns = useMemo(() => findColumns(children), [children]);

  return (
    <ColumnsProvider value={columns}>
      {children}
    </ColumnsProvider>
  );
}
```

**How it works:**

1. `DataTable` searches its children for `Columns` components
2. Uses `findColumns()` utility to extract column definitions
3. Stores them in `ColumnsContext` via `ColumnsProvider`
4. Any `Columns` component in the tree can retrieve these definitions

**Example:**

```tsx
<DataTable data={items}>
  {/* Columns defined here */}
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>

  <Table>
    <TableBody>
      <Rows>
        <Row>
          {/* Columns rendered here using extracted definitions */}
          <Columns />
        </Row>
      </Rows>
    </TableBody>
  </Table>
</DataTable>
```

The first `<Columns>` declares the definitions, the second `<Columns>` renders them.

### 2. Column Behavior: Definition vs Rendering Parts

Columns behave differently depending on which "part" of the table is being rendered:

**In DEFINITION_PART** (column extraction phase):
- `Columns` component returns `null` and doesn't render
- This allows `DataTable` to extract column definitions without rendering them

**In other parts** (HEADER_PART, BODY_PART, FOOTER_PART):
- `Columns` component retrieves stored definitions and renders them
- Individual `Column` components render differently based on the current part

```tsx
export function Columns(props: ColumnsProps) {
  const currentPart = usePart();

  // Don't render during definition extraction
  if (currentPart === DEFINITION_PART) {
    return null;
  }

  // Render in other parts
  const columns = useColumns();
  return <>{columns}</>;
}
```

```tsx
export function Column<D>(props: ColumnProps<D>) {
  const part = usePart();

  // In header: render header cell
  if (part === HEADER_PART) {
    return <HeaderCell>{props.header}</HeaderCell>;
  }

  // In body/footer: render data cell
  return <Cell accessor={props.accessor}>{children}</Cell>;
}
```

### 3. Table Component Expansion to Default Children

The `Table` component automatically expands to include `TableHeader` and `TableBody` if you don't provide children:

```tsx
const defaultChildren = (
  <>
    <TableHeader />
    <TableBody />
  </>
);

export function Table(props: TableProps) {
  const { children = defaultChildren } = props;
  // ...
  return <table>{children}</table>;
}
```

**This means:**

```tsx
// Minimal usage
<Table />

// Expands to:
<Table>
  <TableHeader />
  <TableBody />
</Table>
```

Similarly, `TableHeader`, `TableBody`, and other components have their own default children:

```tsx
// TableHeader defaults
<TableHeader>
  <HeaderRow>
    <Columns />
  </HeaderRow>
</TableHeader>

// TableBody defaults
<TableBody>
  <Rows>
    <Row>
      <Columns />
    </Row>
  </Rows>
</TableBody>
```

This allows for **minimal boilerplate** while maintaining **full customizability**.

### 4. Element Rendering

Elements can be provided from context, props, or a combination of both.

#### Elements from Context

All table components use `TableElementsContext` to get their HTML elements:

```tsx
export function Row(props: RowProps) {
  const elements = useTableElements();
  const el = props.el ?? elements.tr; // Use prop or context element
  // ...
}
```

**Default elements:**

```tsx
export const defaultTableElements: TableElements = {
  table: 'table',
  thead: 'thead',
  tbody: 'tbody',
  tfoot: 'tfoot',
  tr: 'tr',
  th: 'th',
  td: 'td',
};
```

#### Elements from Props

You can override elements via props:

```tsx
<Row el="div">  {/* Use <div> instead of <tr> */}
  <Cell el="span">...</Cell>  {/* Use <span> instead of <td> */}
</Row>
```

#### How Props are Merged

Components use the `addProps` utility from `@ctablex/core` to merge props:

```tsx
export function Cell(props: CellProps) {
  const elements = useTableElements();
  const el = props.el ?? elements.td;
  
  const { accessor, el: _, ...rest } = props;
  
  // Merge props with element
  return addProps(el, {
    ...rest,
    children: <ContentProvider value={value}>{children}</ContentProvider>
  });
}
```

**Key points:**

1. **Element priority**: `props.el` > `elements.td` (prop overrides context)
2. **Prop spreading**: Component props are spread onto the element
3. **Reserved props**: Internal props like `accessor` are filtered out
4. **Children wrapping**: Content is wrapped in providers before being passed as children

**Example of prop merging:**

```tsx
<Cell 
  accessor="name" 
  el="div" 
  className="custom-cell" 
  style={{ color: 'red' }}
/>

// Results in:
<div className="custom-cell" style={{ color: 'red' }}>
  <ContentProvider value={nameValue}>
    <DefaultContent />
  </ContentProvider>
</div>
```

---

## Three-Context System

### 1. ContentContext (from @ctablex/core)

**Purpose:** Flow data through component tree

**Providers:**

- `DataTable` - Provides data array
- `Row` - Provides individual row data
- `Cell` - Provides field value (when accessor is used)

**Consumers:**

- `Row` - Reads data array (via `useContent`)
- `Cell` - Reads row data
- Content components - Read field values

**Example flow:**

```tsx
<ContentProvider value={[item1, item2]}>
  {' '}
  {/* DataTable */}
  <ArrayContent>
    {' '}
    {/* Rows */}
    <ContentProvider value={item1}>
      {' '}
      {/* Row */}
      <FieldContent field="name">
        {' '}
        {/* Cell with accessor */}
        <ContentProvider value="Laptop">
          {' '}
          {/* Cell provides value */}
          <DefaultContent /> {/* Renders "Laptop" */}
        </ContentProvider>
      </FieldContent>
    </ContentProvider>
  </ArrayContent>
</ContentProvider>
```

### 2. PartContext

**Purpose:** Track which section of the table is being rendered

**Parts:**

- `DEFINITION_PART` (`'__DEFINITION__'`) - Column extraction phase
- `HEADER_PART` (`'__HEADER__'`) - Rendering table header
- `BODY_PART` (`'__BODY__'`) - Rendering table body
- `FOOTER_PART` (`'__FOOTER__'`) - Rendering table footer

**Providers:**

- `DataTable` - Sets `DEFINITION_PART`
- `TableHeader` - Sets `HEADER_PART`
- `TableBody` - Sets `BODY_PART`
- `TableFooter` - Sets `FOOTER_PART`

**Consumers:**

- `Column` - Renders differently based on part
- `Columns` - Returns `null` in `DEFINITION_PART`

**Why it exists:**

Enables `Column` to be dual-mode:

```tsx
// Same Column component, different rendering
<Column header="Name" accessor="name" />

// In HEADER_PART:
<th>Name</th>

// In BODY_PART:
<td>{row.name}</td>
```

### 3. ColumnsContext

**Purpose:** Store column definitions for rendering

**Provider:**

- `DataTable` - Extracts columns via `findColumns()` and provides them

**Consumer:**

- `Columns` - Retrieves and renders column definitions

**Flow:**

```tsx
// 1. DataTable extracts columns during DEFINITION_PART
const columns = findColumns(children);  // Finds <Columns> components

// 2. DataTable provides columns via context
<ColumnsProvider value={columns}>

// 3. Columns component retrieves and renders them
function Columns() {
  const columns = useColumns();  // Gets column definitions
  return <>{columns}</>;
}
```

### 4. TableElementsContext

**Purpose:** Provide customizable HTML elements

**Provider:**

- `TableElementsProvider` (optional, user-provided)
- Defaults to `defaultTableElements`

**Consumers:**

- All table components (`Table`, `Row`, `Cell`, etc.)

**Usage:**

```tsx
function Cell() {
  const elements = useTableElements();
  return addProps(props.el ?? elements.td, { children });
}
```

---

## Rendering Phases

The table renders in **two phases**:

### Phase 1: Column Extraction (DEFINITION_PART)

**Goal:** Extract column definitions from children

**Process:**

1. `DataTable` renders children with `DEFINITION_PART` context
2. `Columns` components return `null` (don't render)
3. `findColumns()` searches for `Columns` components in the tree
4. Extracted columns are stored in `ColumnsContext`

**Code:**

```tsx
// DataTable.tsx
const columns = useMemo(() => findColumns(children), [children]);

return (
  <PartProvider value={DEFINITION_PART}>
    <ColumnsProvider value={columns}>{children}</ColumnsProvider>
  </PartProvider>
);
```

```tsx
// Columns.tsx
function Columns(props: ColumnsProps) {
  const currentPart = usePart();

  if (currentPart === DEFINITION_PART) {
    return null; // Don't render during extraction
  }

  // ... render columns
}
```

**Why?**

This allows column definitions to be declared anywhere in the tree, then rendered where needed:

```tsx
<DataTable data={items}>
  {/* Columns defined here */}
  <Columns>
    <Column header="Name" accessor="name" />
  </Columns>

  {/* But rendered here */}
  <Table>
    <TableHeader>
      <HeaderRow>
        <Columns /> {/* Renders extracted columns */}
      </HeaderRow>
    </TableHeader>
  </Table>
</DataTable>
```

### Phase 2: Rendering (HEADER_PART, BODY_PART, FOOTER_PART)

**Goal:** Render the actual table structure

**Process:**

1. `Table` renders `TableHeader`, `TableBody`, `TableFooter`
2. Each section sets its part context
3. `Columns` renders column definitions
4. `Column` renders based on current part:
   - `HEADER_PART` → `HeaderCell` with header content
   - Other parts → `Cell` with row data

**Example:**

```tsx
<Table>
  <TableHeader>
    {' '}
    {/* Sets HEADER_PART */}
    <Columns /> {/* Renders column headers */}
  </TableHeader>

  <TableBody>
    {' '}
    {/* Sets BODY_PART */}
    <Rows>
      {' '}
      {/* Iterates data */}
      <Row>
        {' '}
        {/* Provides row data */}
        <Columns /> {/* Renders column cells */}
      </Row>
    </Rows>
  </TableBody>
</Table>
```

---

## Part-Based Rendering

### Column Dual-Mode Rendering

`Column` behaves differently based on the current part:

```tsx
export function Column<D = any>(props: ColumnProps<D>) {
  const { children = defaultChildren } = props;
  const part = usePart();

  if (part === HEADER_PART) {
    return <HeaderCell el={props.thEl}>{props.header}</HeaderCell>;
  }

  return (
    <Cell accessor={props.accessor} el={props.el}>
      {children}
    </Cell>
  );
}
```

**In HEADER_PART:**

- Returns `<HeaderCell>` with `header` prop
- Ignores `accessor` and `children`

**In other parts (BODY, FOOTER):**

- Returns `<Cell>` with `accessor` and `children`
- Extracts value from row data
- Provides value to children

### Multi-Part Columns

Different column sets for different sections:

```tsx
<DataTable data={items}>
  {/* Default columns (no part) */}
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>

  {/* Footer columns (part="footer") */}
  <Columns part="footer">
    <Column>Total:</Column>
    <Column accessor="total" />
  </Columns>

  <Table>
    <TableBody>
      <Rows>
        <Row>
          <Columns /> {/* Renders default columns */}
        </Row>
      </Rows>
    </TableBody>

    <TableFooter>
      <Row row={summaryData}>
        <Columns part="footer" /> {/* Renders footer columns */}
      </Row>
    </TableFooter>
  </Table>
</DataTable>
```

**How it works:**

1. All `Columns` are extracted in Phase 1
2. `Columns` component filters by `part` prop:

```tsx
function Columns(props: ColumnsProps) {
  const columns = useColumns(); // All extracted columns
  const { part } = props;

  const partColumns = useMemo(
    () => findColumnsByPart(columns, part),
    [columns, part],
  );

  return <>{partColumns}</>;
}
```

3. `findColumnsByPart` matches columns:

```tsx
export function findColumnsByPart(
  columns: ReactNode,
  part: string | undefined,
): ReactNode {
  return Children.map(columns, (child) => {
    if (isValidElement(child)) {
      if (child.props.part === part) {
        return child.props.children; // Return Column children
      }
    }
    return null;
  });
}
```

---

## Column Extraction

### findColumns Utility

Searches the component tree for `Columns` components:

```tsx
export function findColumns(children: ReactNode): ReactNode {
  return Children.map(children, (child): ReactNode => {
    if (isValidElement(child) && isColumnsType(child.type)) {
      return child;
    }
    return null;
  });
}
```

### isColumnsType Check

`Columns` component is marked with a static property:

```tsx
// columns.tsx
export function Columns(props: ColumnsProps) {
  // ...
}

Columns.__COLUMNS__ = true; // Marker for identification
```

```tsx
// types.ts
export interface ColumnsType {
  __COLUMNS__: true;
}

export function isColumnsType(type: any): type is ColumnsType {
  return Boolean(type && type.__COLUMNS__);
}
```

**Why?**

Allows `findColumns` to identify `Columns` components without importing them (avoids circular dependencies).

### Limitations

`findColumns` only searches immediate children, not deeply nested:

```tsx
// ✓ Works - Columns is direct child
<DataTable data={items}>
  <Columns>...</Columns>
  <Table />
</DataTable>

// ✗ Doesn't work - Columns is nested
<DataTable data={items}>
  <div>
    <Columns>...</Columns>  {/* Won't be found */}
  </div>
  <Table />
</DataTable>
```

**Solution:** Keep `Columns` as direct children of `DataTable`.

---

## Data Flow

### Complete Data Flow Example

```tsx
<DataTable data={[{ id: 1, name: 'Laptop', price: 999 }]}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table />
</DataTable>
```

**Step-by-step:**

1. **DataTable** receives data array

   ```tsx
   const data = useContent(props.data); // [{ id: 1, name: 'Laptop', price: 999 }]
   ```

2. **DataTable** extracts columns

   ```tsx
   const columns = findColumns(children); // <Columns>...</Columns>
   ```

3. **DataTable** provides contexts

   ```tsx
   <ContentProvider value={data}>
     <PartProvider value={DEFINITION_PART}>
       <ColumnsProvider value={columns}>{children}</ColumnsProvider>
     </PartProvider>
   </ContentProvider>
   ```

4. **Table** renders with default children

   ```tsx
   <Table>
     <TableHeader />
     <TableBody />
   </Table>
   ```

5. **TableHeader** sets HEADER_PART and renders

   ```tsx
   <PartProvider value={HEADER_PART}>
     <thead>
       <HeaderRow>
         <Columns />
       </HeaderRow>
     </thead>
   </PartProvider>
   ```

6. **Columns** retrieves and renders column definitions

   ```tsx
   const columns = useColumns(); // From ColumnsContext
   return <>{columns}</>; // <Column>...</Column> <Column>...</Column>
   ```

7. **Column** (in HEADER_PART) renders header cell

   ```tsx
   const part = usePart(); // HEADER_PART
   return <HeaderCell>{props.header}</HeaderCell>; // <th>Name</th>
   ```

8. **TableBody** sets BODY_PART

   ```tsx
   <PartProvider value={BODY_PART}>
     <tbody>
       <Rows />
     </tbody>
   </PartProvider>
   ```

9. **Rows** iterates data with ArrayContent

   ```tsx
   <ArrayContent value={data} getKey={getKeyFn}>
     <Row />
   </ArrayContent>
   ```

10. **ArrayContent** provides each item via context

    ```tsx
    <ContentProvider value={{ id: 1, name: 'Laptop', price: 999 }}>
      <Row />
    </ContentProvider>
    ```

11. **Row** provides row data and renders

    ```tsx
    const row = useContent(); // { id: 1, name: 'Laptop', price: 999 }
    return (
      <ContentProvider value={row}>
        <tr>
          <Columns />
        </tr>
      </ContentProvider>
    );
    ```

12. **Columns** renders column definitions again

    ```tsx
    return <>{columns}</>; // <Column>...</Column> <Column>...</Column>
    ```

13. **Column** (in BODY_PART) renders cell

    ```tsx
    const part = usePart(); // BODY_PART
    return <Cell accessor={props.accessor}>{children}</Cell>;
    ```

14. **Cell** extracts value and provides it

    ```tsx
    const content = useContent(); // { id: 1, name: 'Laptop', price: 999 }
    const value = access(content, 'name'); // "Laptop"
    return (
      <ContentProvider value={value}>
        <td>
          {children} // <DefaultContent />
        </td>
      </ContentProvider>
    );
    ```

15. **DefaultContent** renders the value
    ```tsx
    const value = useContent(); // "Laptop"
    return <>{value}</>; // Laptop
    ```

**Final output:**

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
      <td>Laptop</td>
      <td>999</td>
    </tr>
  </tbody>
</table>
```

---

## Component Lifecycle

### DataTable Lifecycle

```tsx
export function DataTable<D>(props: DataTableProps<D>) {
  const { children } = props;
  const data = useContent(props.data);

  // Extract columns once when children change
  const columns = useMemo(() => findColumns(children), [children]);

  return (
    <ContentProvider value={data}>
      <PartProvider value={DEFINITION_PART}>
        <ColumnsProvider value={columns}>{children}</ColumnsProvider>
      </PartProvider>
    </ContentProvider>
  );
}
```

**Key points:**

- `data` can come from props or context (via `useContent`)
- Columns are extracted with `useMemo` to avoid re-extraction
- Three contexts are set up in specific order

### Rows Lifecycle

```tsx
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

**Key points:**

- Uses `ArrayContent` from `@ctablex/core`
- `getKey` is memoized with `useCallback`
- If `rows` prop is omitted, `ArrayContent` uses context data

### Column Lifecycle

```tsx
export function Column<D = any>(props: ColumnProps<D>) {
  const { children = defaultChildren } = props;
  const part = usePart();

  if (part === HEADER_PART) {
    return <HeaderCell el={props.thEl}>{props.header}</HeaderCell>;
  }

  return (
    <Cell accessor={props.accessor} el={props.el}>
      {children}
    </Cell>
  );
}
```

**Key points:**

- Renders on every part change
- Default children (`<DefaultContent />`) are constant reference
- Part determines which sub-component to render

---

## Performance Considerations

### Immutable Children Pattern

Components use default children with stable references:

```tsx
const defaultChildren = <DefaultContent />;

export function Column<D = any>(props: ColumnProps<D>) {
  const { children = defaultChildren } = props;
  // ...
}
```

**Benefits:**

- React can skip re-rendering when children haven't changed
- Reduces reconciliation work

### useMemo for Column Extraction

```tsx
const columns = useMemo(() => findColumns(children), [children]);
```

**Why:**

- Avoids re-searching component tree on every render
- Columns only re-extracted when children change

### useCallback for Key Accessor

```tsx
const getKey = useCallback(
  (data: D, index: number) => {
    if (!keyAccessor) {
      return index;
    }
    return accessTo(data, keyAccessor);
  },
  [keyAccessor],
);
```

**Why:**

- Prevents `ArrayContent` from re-rendering unnecessarily
- Stable function reference

### Context Optimization

`ContentProvider` uses `useMemo` internally:

```tsx
// From @ctablex/core
export function ContentProvider<V>({
  value,
  children,
}: ContentProviderProps<V>) {
  const ctx = useMemo(() => ({ value }), [value]);
  return (
    <ContentContext.Provider value={ctx}>{children}</ContentContext.Provider>
  );
}
```

**Benefits:**

- Only updates context when value actually changes
- Prevents downstream re-renders

### Memoizing Content Components

Custom content components can be memoized:

```tsx
const PriceCell = memo(function PriceCell() {
  const price = useContent<number>();
  return <span>${price.toFixed(2)}</span>;
});
```

**When to memoize:**

- Expensive rendering logic
- Components that render frequently
- Stable props/context values

---

## Related Documentation

- **[OVERVIEW.md](./OVERVIEW.md)** - Getting started guide
- **[COMPONENTS.md](./COMPONENTS.md)** - Component API reference
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Customization options
- **[@ctablex/core - Micro-Context](../../ctablex-core/docs/MICRO-CONTEXT.md)** - Core pattern explanation
