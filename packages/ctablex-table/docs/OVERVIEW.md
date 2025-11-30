# Overview

**@ctablex/table** is a React table library built on the [micro-context pattern](@ctablex/core) that enables flexible, composable table components with minimal boilerplate.

## Installation

```bash
npm install @ctablex/table @ctablex/core
# or
pnpm add @ctablex/table @ctablex/core
# or
yarn add @ctablex/table @ctablex/core
```

## Quick Start

```tsx
import { DataTable, Columns, Column, Table } from '@ctablex/table';

const products = [
  { id: 1, name: 'Laptop', price: 999, inStock: true },
  { id: 2, name: 'Mouse', price: 29, inStock: false },
  { id: 3, name: 'Keyboard', price: 79, inStock: true },
];

function ProductTable() {
  return (
    <DataTable data={products}>
      <Columns>
        <Column header="Name" accessor="name" />
        <Column header="Price" accessor="price" />
        <Column header="In Stock" accessor="inStock" />
      </Columns>
      <Table />
    </DataTable>
  );
}
```

This renders a basic HTML table with three columns. The library handles:

- Array iteration over products
- Column headers
- Cell value extraction via accessors
- Default rendering for primitive values

## How It Works (High Level)

### Data Flow Through Micro-Context

Instead of passing data through props, **@ctablex/table** uses React Context to flow data through component hierarchies:

```tsx
<DataTable data={products}>
  {/* Provides products array via context */}
  <Columns>
    {/* Defines column structure */}
    <Column accessor="name" /> {/* Extracts "name" field */}
  </Columns>
  <Table /> {/* Renders the table */}
</DataTable>
```

**Flow:**

1. `DataTable` provides the data array via context
2. `Table` iterates over rows, providing each product via context
3. `Column` uses the accessor to extract the field value
4. Default content renderer displays the value

This pattern enables components to be decoupled - child components don't need to know about parent props.

### Component Hierarchy

```
DataTable (provides data + column definitions)
└── Table (renders <table>)
    ├── TableHeader (renders <thead>)
    │   └── HeaderRow (renders <tr>)
    │       └── Columns (renders column headers)
    │           └── Column (renders <th>)
    └── TableBody (renders <tbody>)
        └── Rows (iterates data array)
            └── Row (provides row data)
                └── Columns (renders row cells)
                    └── Column (renders <td>)
```

Each component has a specific role, and they compose together to build the full table structure.

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

### Context Nesting

Data flows through nested contexts:

```tsx
<ContentProvider value={products}>
  {/* Array context */}
  <ArrayContent>
    {/* Iterates array */}
    <ContentProvider value={product}>
      {/* Single product context */}
      <FieldContent field="name">
        {/* Extracts field */}
        <ContentProvider value="Laptop">
          {/* String value context */}
          <DefaultContent /> {/* Renders "Laptop" */}
        </ContentProvider>
      </FieldContent>
    </ContentProvider>
  </ArrayContent>
</ContentProvider>
```

This is what happens internally when you use `<DataTable>`, `<Table>`, and `<Column>`.

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

⚠️ **Note:** Generics must be added manually. TypeScript cannot automatically infer types across context boundaries. See the [micro-context type safety limitations](@ctablex/core/docs/MICRO-CONTEXT.md#type-safety-limitations) for details.

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
