# Components API Reference

Complete reference for all components in **@ctablex/table**.

## Table of Contents

- [DataTable](#datatable)
- [Columns](#columns)
- [Column](#column)
- [Table](#table)
- [TableHeader](#tableheader)
- [HeaderRow](#headerrow)
- [HeaderCell](#headercell)
- [TableBody](#tablebody)
- [Rows](#rows)
- [Row](#row)
- [Cell](#cell)
- [TableFooter](#tablefooter)
- [Re-exported Components](#re-exported-components)

---

## DataTable

The root component that extracts and provides column definitions and data to the table.
It serves two main purposes:

- Extract column definitions from `<Columns>` components and provide them via columns context
- Provide data to the table via content context

### Behavior

This component does not render any DOM elements itself.

First, it extracts column definitions from its immediate children, typically `<Columns>` components. Any component can be marked as a definition by setting the `__COLUMNS__` static property to `true` on its type.

Next, it optionally accepts a `data` prop and provides it via content context. If the `data` prop is not provided but content context already contains data, it uses the existing data. If neither is available, it throws an error.

Finally, it renders its children with definition components removed from the tree.

### Examples

**Extracting column definitions:**

```tsx
<DataTable data={data}>
  <Columns>Columns definition...</Columns>
  <div>Other children...</div>
</DataTable>
```

The `<Columns>` component is extracted and removed from the render tree. Only `<div>Other children...</div>` is rendered.

**Error case - no data available:**

```tsx
<DataTable>{/* Children */}</DataTable>
```

Throws an error because neither `data` prop nor content context provides data.

**Basic usage with data prop:**

```tsx
<DataTable data={data}>{/* Children */}</DataTable>
```

Provides `data` to children via content context.

**Using existing content context:**

```tsx
<ContentProvider value={data}>
  <DataTable>{/* Children */}</DataTable>
</ContentProvider>
```

No `data` prop needed—uses the existing data from content context.

**Data prop overrides context:**

```tsx
<ContentProvider value={outer}>
  <DataTable data={inner}>{/* Children */}</DataTable>
</ContentProvider>
```

The `data` prop takes precedence. Children receive `inner` instead of `outer`.

**Custom column container components:**

```tsx
function MyColumns() {
  return (
    <>
      <Column accessor="name" header="Name" />
      <Column accessor="age" header="Age" />
    </>
  );
}
MyColumns.__COLUMNS__ = true; // Mark as column container
```

You can create reusable column definition components by marking them with `__COLUMNS__ = true`.

```tsx
<DataTable data={items}>
  <MyColumns />
</DataTable>
```

`<MyColumns />` is extracted and removed from the render tree because it's marked as a column container.

**Non-immediate children are not extracted:**

```tsx
<DataTable data={items}>
  <>
    <Columns>{/* ... */}</Columns>
  </>
</DataTable>
```

The `<Columns>` component is wrapped in a fragment, so it's not an immediate child. It will be rendered instead of being extracted. Read more about this behavior in the [Columns](./COMPONENTS.md#columns) documentation.

## Columns

Container for column definitions. It is marked as a column definition by setting the `__COLUMNS__` static property to `true` on its type and is extracted by `<DataTable>` when it is an immediate child.

When it is not an immediate child of `<DataTable>`, it will be rendered. It does not render any DOM elements itself and does not render its own children. Instead, it renders children provided by `<DataTable>` via columns context.

It also accepts a `part` prop to identify different column groups. When a `part` prop is provided, it renders only the children of the matching part from columns context. If more than one `<Columns>` with the same `part` exists, all definitions are rendered.

### Examples

**Common usage scenario:**

```tsx
<DataTable data={data}>
  <Columns>
    <Column accessor="id" header="ID" />
    <Column accessor="name" header="Name" />
  </Columns>
  <Table />
</DataTable>
```

The `<Columns>` component is extracted by `<DataTable>`, and the column definitions are provided to `<Table>` via columns context. `<Table />` expands to its default children:

```tsx
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
```

When `<Columns />` is rendered in different contexts (header vs body), it outputs the same column definitions. This allows you to define columns once and use them in multiple places.

**Basic usage:**

```tsx
<DataTable data={data}>
  <Columns>
    <span>in Columns</span>
  </Columns>
  <div>
    <span>outside Columns</span>
    <Columns />
  </div>
</DataTable>
```

The `<Columns>` definition is extracted by `<DataTable>`. When rendered inside the `<div>`, it outputs its defined children:

```html
<div>
  <span>outside Columns</span>
  <span>in Columns</span>
</div>
```

**Using the `part` prop:**

```tsx
<DataTable data={data}>
  <Columns>
    <span>no part</span>
  </Columns>
  <Columns part="detail">
    <span>in Detail</span>
  </Columns>
  <div>
    <span>outside Columns</span>
    <Columns />
    <div class="detail">
      <Columns part="detail" />
    </div>
  </div>
</DataTable>
```

The first `<Columns />` renders the default definition, while `<Columns part="detail" />` renders the matching part:

```html
<div>
  <span>outside Columns</span>
  <span>no part</span>
  <div class="detail">
    <span>in Detail</span>
  </div>
</div>
```

## Column

The Column component behaves differently depending on its rendering context. This dual behavior helps keep header and data cell definitions together in one place.

**Inside a header context** (e.g., within `<TableHeader>`):

The Column renders a `<HeaderCell>` component (`<th>` element) and passes the `header` prop as its children. It also passes the `thEl` prop to the HeaderCell as the `el` prop.

```tsx
<HeaderCell el={props.thEl}>{props.header}</HeaderCell>
```

**Outside a header context** (e.g., within `<TableBody>`):

The Column renders a `<Cell>` component (`<td>` element) and passes the `accessor` prop to Cell as the data accessor. It also passes the `el` prop to Cell as the `el` prop.

```tsx
<Cell accessor={props.accessor} el={props.el}>
  {children}
</Cell>
```

<!-- default children of Column is <DefaultContent /> -->

## Table

Renders the `<table>` element and its structure. It has default children `<TableHeader>` and `<TableBody>`, but you can customize the structure by providing your own children.

The element that `<Table>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<table>` element is rendered.

### Examples

**Basic usage:**

```tsx
<Table />
```

This is the same as:

```tsx
<Table>
  <TableHeader />
  <TableBody />
</Table>
```

**Customizing table structure:**

```tsx
<Table>
  <TableHeader />
  <TableBody />
  <TableFooter />
</Table>
```

You can override the default children to add additional sections like a footer.

**Customizing table element:**

```tsx
<Table el={<table className="my-table" />} />
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  table: <table className="app-table" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <Table />
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ table: <table className="app-table" /> }}>
  <Table el={<table className="my-table" />} />
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered table will have the class `my-table`.

**Replacing table with a different element:**

```tsx
<Table el={<div className="grid" />} />
```

Renders a `<div>` with class `grid` instead of a `<table>`.

**Warning about `el` children:**

```tsx
<Table el={<div>el child</div>}>children</Table>
```

Renders `<div>el child</div>` and ignores `children`. The `el` prop's children take precedence over `<Table>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<Table>`'s children instead to maintain clarity and expected behavior.

## TableHeader

Renders the `<thead>` element. It has default children `<HeaderRow />`, but you can customize by providing your own children.

The element that `<TableHeader>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<thead>` element is rendered.

The component also provides header context (`IsHeaderContext` set to `true`) which is used by `<Column>` components to determine whether they should render as header cells (`<th>`) or data cells (`<td>`).

### Examples

**Basic usage:**

```tsx
<TableHeader />
```

This is the same as:

```tsx
<TableHeader>
  <HeaderRow />
</TableHeader>
```

**Customizing header structure:**

```tsx
<TableHeader>
  <HeaderRow />
  <HeaderRow />
</TableHeader>
```

You can provide multiple header rows or other custom structure.

**Customizing thead element:**

```tsx
<TableHeader el={<thead className="my-header" />} />
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  thead: <thead className="app-header" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <TableHeader />
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ thead: <thead className="app-header" /> }}>
  <TableHeader el={<thead className="my-header" />} />
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered thead will have the class `my-header`.

**Replacing thead with a different element:**

```tsx
<TableHeader el={<div className="header-section" />} />
```

Renders a `<div>` with class `header-section` instead of a `<thead>`.

**Warning about `el` children:**

```tsx
<TableHeader el={<thead>el child</thead>}>children</TableHeader>
```

Renders `<thead>el child</thead>` and ignores `children`. The `el` prop's children take precedence over `<TableHeader>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<TableHeader>`'s children instead to maintain clarity and expected behavior.

## HeaderRow

Renders the `<tr>` element for the header row. It has default children `<Columns />`, but you can customize by providing your own children.

The element that `<HeaderRow>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<tr>` element is rendered.

### Examples

**Basic usage:**

```tsx
<HeaderRow />
```

This is the same as:

```tsx
<HeaderRow>
  <Columns />
</HeaderRow>
```

**Customizing header row content:**

```tsx
<HeaderRow>
  <th>ID</th>
  <th>Name</th>
</HeaderRow>
```

You can provide custom content or use specific column parts.

**Customizing tr element:**

```tsx
<HeaderRow el={<tr className="my-header-row" />} />
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  tr: <tr className="app-row" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <HeaderRow />
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ tr: <tr className="app-row" /> }}>
  <HeaderRow el={<tr className="my-header-row" />} />
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered tr will have the class `my-header-row`.

**Replacing tr with a different element:**

```tsx
<HeaderRow el={<div className="header-row" />} />
```

Renders a `<div>` with class `header-row` instead of a `<tr>`.

**Warning about `el` children:**

```tsx
<HeaderRow el={<tr>el child</tr>}>children</HeaderRow>
```

Renders `<tr>el child</tr>` and ignores `children`. The `el` prop's children take precedence over `<HeaderRow>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<HeaderRow>`'s children instead to maintain clarity and expected behavior.

## HeaderCell

Renders the `<th>` element for table headers. This component does not have default children.

The element that `<HeaderCell>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<th>` element is rendered.

**Note:** Most of the time, this component is not used directly. Instead, it is rendered by the `<Column>` component when inside a header context (e.g., within `<TableHeader>`). `header` and `thEl` props of `<Column>` are passed to `<HeaderCell>` as children and `el` respectively.

### Examples

**Basic usage:**

```tsx
<HeaderCell>Name</HeaderCell>
```

Renders a simple header cell with text content.

**Typical usage via Column:**

```tsx
<TableHeader>
  <HeaderRow>
    <Column header="Name" accessor="name" />
  </HeaderRow>
</TableHeader>
```

The `<Column>` component internally renders `<HeaderCell>` when in header context. This is the recommended approach.

**Customizing th element:**

```tsx
<HeaderCell el={<th className="my-header-cell" />}>Name</HeaderCell>
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  th: <th className="app-header-cell" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <HeaderCell>Name</HeaderCell>
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ th: <th className="app-header-cell" /> }}>
  <HeaderCell el={<th className="my-header-cell" />}>Name</HeaderCell>
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered th will have the class `my-header-cell`.

**Replacing th with a different element:**

```tsx
<HeaderCell el={<div className="header-cell" />}>Name</HeaderCell>
```

Renders a `<div>` with class `header-cell` instead of a `<th>`.

**Warning about `el` children:**

```tsx
<HeaderCell el={<th>el child</th>}>children</HeaderCell>
```

Renders `<th>el child</th>` and ignores `children`. The `el` prop's children take precedence over `<HeaderCell>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<HeaderCell>`'s children instead to maintain clarity and expected behavior.

## TableBody

Renders the `<tbody>` element for the table body. It has default children `<Rows />`, but you can customize by providing your own children.

The element that `<TableBody>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<tbody>` element is rendered.

### Examples

**Basic usage:**

```tsx
<TableBody />
```

This is the same as:

```tsx
<TableBody>
  <Rows />
</TableBody>
```

**Customizing tbody element:**

```tsx
<TableBody el={<tbody className="my-body" />} />
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  tbody: <tbody className="app-body" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <TableBody />
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ tbody: <tbody className="app-body" /> }}>
  <TableBody el={<tbody className="my-body" />} />
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered tbody will have the class `my-body`.

**Replacing tbody with a different element:**

```tsx
<TableBody el={<div className="body-section" />} />
```

Renders a `<div>` with class `body-section` instead of a `<tbody>`.

**Custom body structure:**

```tsx
<TableBody>
  <Rows />
  <tr>
    <td colSpan={3}>Custom summary row</td>
  </tr>
</TableBody>
```

You can provide custom content in addition to or instead of `<Rows />`.

**Warning about `el` children:**

```tsx
<TableBody el={<tbody>el child</tbody>}>children</TableBody>
```

Renders `<tbody>el child</tbody>` and ignores `children`. The `el` prop's children take precedence over `<TableBody>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<TableBody>`'s children instead to maintain clarity and expected behavior.

## Rows

Iterates over data items and renders a row for each item. This component does not render any DOM elements itself.

It has default children `<Row />` which is rendered for each item in the data array. You can customize by providing your own children.

The component uses `<ArrayContent>` from `@ctablex/core` to iterate over items from content context. It also accepts a `keyAccessor` prop to extract React keys from each item. If not provided, the array index is used as the key.

### Examples

**Basic usage:**

```tsx
<Rows />
```

This is the same as:

```tsx
<Rows>
  <Row />
</Rows>
```

Renders a `<Row />` for each item in the data array from content context.

**Using keyAccessor:**

```tsx
<Rows keyAccessor="id" />
```

Extracts the `id` property from each data item to use as the React key. This is recommended for better performance and avoiding reconciliation issues.

**Custom row components:**

```tsx
<Rows>
  <Row el={<tr className="data-row" />} />
</Rows>
```

You can customize the row component that gets rendered for each item.

**Multiple row types:**

```tsx
<Rows>
  <Row />
  <Row el={<tr className="detail-row" />}>
    <td colSpan={3}>
      <Columns part="detail" />
    </td>
  </Row>
</Rows>
```

Renders multiple rows for each data item. This is useful for master-detail patterns.

## Row

Renders the `<tr>` element for a table row. It has default children `<Columns />`, but you can customize by providing your own children.

The element that `<Row>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<tr>` element is rendered.

By default, the component reads data from content context. This can be overridden by providing a `row` prop. If the `row` prop is provided, that data will be provided as content context for the children instead.

### Examples

**Basic usage:**

```tsx
<Row />
```

This is the same as:

```tsx
<Row>
  <Columns />
</Row>
```

**Customizing tr element:**

```tsx
<Row el={<tr className="my-row" />} />
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  tr: <tr className="app-row" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <Row />
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ tr: <tr className="app-row" /> }}>
  <Row el={<tr className="my-row" />} />
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered tr will have the class `my-row`.

**Overriding row data:**

```tsx
<Row row={customData}>
  <Columns />
</Row>
```

Provides `customData` to children via content context instead of the data from parent context. This is useful for special rows like summaries.

**Custom row content:**

```tsx
<Row>
  <td>Custom</td>
  <Columns />
  <td>Actions</td>
</Row>
```

You can mix custom cells with column-based cells.

**Replacing tr with a different element:**

```tsx
<Row el={<div className="row" />} />
```

Renders a `<div>` with class `row` instead of a `<tr>`.

**Warning about `el` children:**

```tsx
<Row el={<tr>el child</tr>}>children</Row>
```

Renders `<tr>el child</tr>` and ignores `children`. The `el` prop's children take precedence over `<Row>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<Row>`'s children instead to maintain clarity and expected behavior.

## Cell

Renders the `<td>` element for table data cells. This component does not have default children.

The element that `<Cell>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<td>` element is rendered.

The component accepts an `accessor` prop to read data from content context. It extracts the value using the accessor and provides it via content context to its children. If the `accessor` is undefined, the content context is passed as is without extraction.

**Note:** Most of the time, this component is not used directly. Instead, it is rendered by the `<Column>` component when outside a header context. The `accessor`, `el`, and `children` props of `<Column>` are passed to `<Cell>`. While `<Cell>` itself has no default children, `<Column>` provides `<DefaultContent />` as default children.

**Note:** The `el` prop renders inside the content extracted by `accessor`. This means custom element components can access the extracted value via `useContent()`. If you need access to the entire item instead of just the extracted value, omit the `accessor` prop and use `<ContentValue />` with its own `accessor` in the children.

### Examples

**Basic usage:**

```tsx
<Cell accessor="name">
  <DefaultContent />
</Cell>
```

Reads the `name` property from content context and provides it to children.

**Typical usage via Column:**

```tsx
<TableBody>
  <Rows>
    <Row>
      <Column accessor="name" header="Name" />
    </Row>
  </Rows>
</TableBody>
```

The `<Column>` component internally renders `<Cell>` when outside header context.

**Customizing td element:**

```tsx
<Cell accessor="price" el={<td className="my-cell" />}>
  <DefaultContent />
</Cell>
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  td: <td className="app-cell" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <Cell accessor="name">
    <DefaultContent />
  </Cell>
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ td: <td className="app-cell" /> }}>
  <Cell accessor="price" el={<td className="my-cell" />}>
    <DefaultContent />
  </Cell>
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered td will have the class `my-cell`.

**No accessor (pass through):**

```tsx
<Cell>
  <CustomComponent />
</Cell>
```

Without an `accessor`, the entire content context is passed to children unchanged. Useful when you want full control over the cell content.

**Custom cell content:**

```tsx
<Cell accessor="status">
  <StatusBadge />
</Cell>
```

Provide custom components to render the cell content in a specific way.

**Nested accessors:**

```tsx
<Cell accessor="user.name">
  <DefaultContent />
</Cell>
```

Access nested properties using dot notation.

**Replacing td with a different element:**

```tsx
<Cell accessor="name" el={<div className="cell" />}>
  <DefaultContent />
</Cell>
```

Renders a `<div>` with class `cell` instead of a `<td>`.

**el accessing extracted content:**

```tsx
function ColoredTd() {
  const content = useContent();
  const color = content === 'Active' ? 'green' : 'red';
  return <td style={{ color }}>{content}</td>;
}
```

```tsx
<Cell accessor="status" el={<ColoredTd />}>
  <DefaultContent />
</Cell>
```

The custom `ColoredTd` component receives the extracted `status` value via `useContent()` and applies conditional styling.

**el accessing full item:**

```tsx
function StatusTd(props: Props) {
  const item = useContent();
  const color = item.status === 'Active' ? 'green' : 'red';
  return <td style={{ color }}>{props.children}</td>;
}
```

```tsx
<Cell el={<StatusTd />}>
  <ContentValue accessor="name">
    <DefaultContent />
  </ContentValue>
</Cell>
```

Without an `accessor` on `<Cell>`, the custom element receives the full item and can access multiple properties.

**Warning about `el` children:**

```tsx
<Cell accessor="name" el={<td>el child</td>}>
  children
</Cell>
```

Renders `<td>el child</td>` and ignores `children`. The `el` prop's children take precedence over `<Cell>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<Cell>`'s children instead to maintain clarity and expected behavior.

## TableFooter

Renders the `<tfoot>` element for the table footer. It does not have default children.

The element that `<TableFooter>` renders can be customized via table element context or the `el` prop:

- If the `el` prop is provided, it is used to render the element.
- If table element context provides a value, it is used to render the element.
- Otherwise, a default `<tfoot>` element is rendered.

### Examples

**Basic usage:**

```tsx
<TableFooter>
  <tr>
    <td colSpan={3}>Footer content</td>
  </tr>
</TableFooter>
```

**Customizing tfoot element:**

```tsx
<TableFooter el={<tfoot className="my-footer" />}>
  <tr>
    <td colSpan={3}>Footer content</td>
  </tr>
</TableFooter>
```

Use the `el` prop to customize the rendered element with your own props like className.

**Using table element context:**

```tsx
const elements = {
  tfoot: <tfoot className="app-footer" />,
  // other elements...
};
```

```tsx
<TableElementProvider value={elements}>
  <TableFooter>
    <tr>
      <td colSpan={3}>Footer content</td>
    </tr>
  </TableFooter>
</TableElementProvider>
```

Provide custom elements via context to apply styling consistently across all table components.

**Combining `el` prop and context:**

```tsx
<TableElementProvider value={{ tfoot: <tfoot className="app-footer" /> }}>
  <TableFooter el={<tfoot className="my-footer" />}>
    <tr>
      <td colSpan={3}>Footer content</td>
    </tr>
  </TableFooter>
</TableElementProvider>
```

The `el` prop takes precedence over context. The rendered tfoot will have the class `my-footer`.

**Replacing tfoot with a different element:**

```tsx
<TableFooter el={<div className="footer-section" />}>
  <span>Footer content</span>
</TableFooter>
```

Renders a `<div>` with class `footer-section` instead of a `<tfoot>`.

**Warning about `el` children:**

```tsx
<TableFooter el={<tfoot>el child</tfoot>}>children</TableFooter>
```

Renders `<tfoot>el child</tfoot>` and ignores `children`. The `el` prop's children take precedence over `<TableFooter>`'s children.

**Note:** Avoid passing children to the `el` prop. Use `<TableFooter>`'s children instead to maintain clarity and expected behavior.

## Re-exported Components

Some components are re-exported from `@ctablex/core` for convenience.

- [DefaultContent](./COMPONENTS.md#defaultcontent)
- [NullContent](./COMPONENTS.md#nullcontent)
- [ContentValue](./COMPONENTS.md#contentvalue)
