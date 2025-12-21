# Overview

**@ctablex/table** is a React table library built on the [micro-context pattern](@ctablex/core) that enables flexible, composable table components with minimal boilerplate.

## Installation

```bash
npm install @ctablex/table
# or
pnpm add @ctablex/table
```

## Quick Start

```tsx
import { DataTable, Columns, Column, Table } from '@ctablex/table';

const products = [
  { id: 1, name: 'Laptop', price: 999, inStock: true },
  { id: 2, name: 'Mouse', price: 29, inStock: false },
  { id: 3, name: 'Keyboard', price: 79, inStock: true, description: 'Mechanical keyboard' },
];

function ProductTable() {
  return (
    <DataTable data={products}>
      <Columns>
        <Column header="Name" accessor="name" />
        <Column header="Price" accessor="price" />
      </Columns>
      <Table />
    </DataTable>
  );
}
```

This renders a basic HTML table with two columns. The library handles:

- Array iteration over products
- Column headers
- Cell value extraction via accessors
- Default rendering for primitive values

## How It Works (High Level)

### Data Flow Through Micro-Context

Instead of passing data through props, **@ctablex/table** uses React Context to flow data through component hierarchies.

**What you write:**

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price" />
  </Columns>
  <Table />
</DataTable>
```

**What actually renders:** Table components has proper default children that expand to full structure:

```tsx
<DataTable data={products}>
  {/* Columns definitions are extracted and removed from the render tree by DataTable */}

  {/* Table expands to its default children */}
  <Table>
    <TableHeader>
      <HeaderRow>
        {/* Column definitions are rendered as headers */}
        <Columns>
          {/* HeaderCell use "header" prop to render <th> */}
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Price</HeaderCell>
        </Columns>
      </HeaderRow>
    </TableHeader>
    <TableBody>
      {/* Rows iterates over products array */}
      <Rows>
        {/* Each product is provided via context to Row + render <tr> */}
        <Row>
          {/* Column definitions are rendered as cells */}
          <Columns>
            {/* Accessor extracts "name" field and provide it via context to render <td> */}
            <Cell accessor="name">
              <DefaultContent />
            </Cell>
            {/* Accessor extracts "price" field and provide it via context to render <td> */}
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

This pattern enables components to be **decoupled** - child components access data from context rather than receiving it through props, making them reusable and composable.

## Custom Content Rendering

Columns can render custom content instead of default primitive values:

```tsx
import { NullableContent, DefaultContent } from '@ctablex/table';

function BooleanContent({ yes, no }: { yes: string; no: string }) {
  const value = useContent<boolean>();
  return <>{value ? yes : no}</>;
}

function NumberContent() {
  const value = useContent<number>();
  return <>{value.toFixed(2)}</>;
}

<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price">
      <NumberContent />
    </Column>
    <Column header="In Stock" accessor="inStock">
      <BooleanContent yes="✓" no="✗" />
    </Column>
    <Column header="Description" accessor="description">
      <NullableContent nullContent="N/A">
        <DefaultContent />
      </NullableContent>
    </Column>
  </Columns>
  <Table />
</DataTable>;
```

**Key insight:** The children of `Column` receive the extracted field value via context and can render it however they want.

## Complex Cell Content

Cells can render multiple values or computed content:

```tsx
import { ContentValue } from '@ctablex/table';

<Column header="Total">
  <ContentValue accessor="price">
    <NumberContent />
  </ContentValue>
  {' × '}
  <ContentValue accessor="quantity">
    <DefaultContent />
  </ContentValue>
  {' = '}
  <ContentValue accessor={(item) => item.price * item.quantity}>
    <NumberContent />
  </ContentValue>
</Column>;
```

`ContentValue` extracts a value and provides it via context to its children, enabling multiple field accesses within a single cell.

## Multi-Part Columns

Tables often need different column sets for different sections (body, footer, summary rows):

```tsx
const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

<DataTable data={products}>
  {/* Main columns for data rows */}
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Price" accessor="price">
      <NumberContent />
    </Column>
  </Columns>

  {/* Footer columns with different structure */}
  <Columns part="footer">
    <Column>Total:</Column>
    <Column accessor="total">
      <NumberContent />
    </Column>
  </Columns>

  <Table>
    <TableHeader />
    <TableBody>
      {/* Renders main columns for each product */}
      <Rows />
      {/* Custom row with manual cell definition (not using Columns) */}
      <Row>
        <Column el={<td colSpan={2} style={{ textAlign: 'center' }} />}>
          Custom content spanning multiple columns
        </Column>
      </Row>
    </TableBody>
    <TableFooter>
      {/* Renders footer columns with total data */}
      <Row row={{ total: totalPrice }}>
        <Columns part="footer" />
      </Row>
    </TableFooter>
  </Table>
</DataTable>;
```

**How parts work:**

- `Columns` components define column sets with optional `part` prop
- Default columns (no part) render in standard rows
- Named parts (`part="footer"`) render when explicitly requested
- This enables flexible table structures with different column configurations

## Key Concepts

### Accessors

Accessors extract values from row data. They can be:

**String path accessors:**

```tsx
<Column accessor="name" />
<Column accessor="user.address.city" />
```

**Function accessors:**

```tsx
<Column accessor={(product) => product.price * product.quantity} />
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

⚠️ **Note:** Since the default child is `<DefaultContent />`, omitting the accessor with default children will cause a React error (objects cannot be rendered). For empty cells, pass `{null}` as children or accessor:

```tsx
{
  /* Empty cell - option 1: null children */
}
<Column header="Actions">{null}</Column>;

{
  /* Empty cell - option 2: null accessor */
}
<Column header="Actions" accessor={null} />;
```

### Default Children

Most components have sensible defaults, reducing boilerplate:

```tsx
// These are equivalent:
<Table />

<Table>
  <TableHeader />
  <TableBody />
</Table>

// These are equivalent:
<Column accessor="name" />

<Column accessor="name">
  <DefaultContent />
</Column>
```

## Type Safety

TypeScript support with generic types:

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
};

<DataTable<Product> data={products}>
  <Columns>
    {/* TypeScript validates accessor fields */}
    <Column<Product> header="Name" accessor="name" />
    <Column<Product> header="Price" accessor="price" />
  </Columns>
  <Table />
</DataTable>;
```

⚠️ **Note:** Generics must be added manually. TypeScript cannot automatically infer types across context boundaries. See the [micro-context type safety limitations](../../ctablex-core/docs/MICRO-CONTEXT.md#weak-type-safety) for details.

## Common Patterns

### Basic Table

```tsx
<DataTable data={items}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Value" accessor="value" />
  </Columns>
  <Table />
</DataTable>
```

### Custom Content

```tsx
<Column header="Active" accessor="isActive">
  <BooleanContent yes="Yes" no="No" />
</Column>
```

### Complex Cells

```tsx
<Column header="Full Name">
  <ContentValue accessor="firstName">
    <DefaultContent />
  </ContentValue>{' '}
  <ContentValue accessor="lastName">
    <DefaultContent />
  </ContentValue>
</Column>
```

### Custom Table Structure

```tsx
<Table>
  <TableHeader />
  <TableBody>
    <Rows keyAccessor="id">
      <Row>
        <Columns />
      </Row>
    </Rows>
  </TableBody>
</Table>
```

## Next Steps

- **[COMPONENTS.md](./COMPONENTS.md)** - Complete API reference for all components
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Learn how to customize table rendering
- **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)** - Deep dive into internal architecture
- **[@ctablex/core docs](../../ctablex-core/docs)** - Learn about the micro-context pattern
