# Micro-Context Pattern

## What is Micro-Context?

**Micro-context** is a pattern for passing data through localized React Context instead of props. Unlike traditional "macro-context" patterns (like theme providers or auth state that span entire applications), micro-context creates small, scoped context providers within component subtrees for fine-grained data flow.

## The Problem It Solves

In traditional React patterns, data flows through props:

```tsx
<Table data={data}>
  <Row item={data[0]}>
    <Cell value={data[0].price}>
      <NumberFormatter value={data[0].price} />
    </Cell>
  </Row>
</Table>
```

This leads to:

- **Prop drilling** - Every intermediate component must accept and pass props
- **Tight coupling** - Child components are explicitly bound to parent props
- **Limited composition** - Hard to create reusable renderers that work in different contexts

## The Micro-Context Solution

Instead of passing data as props, wrap it in a context provider:

```tsx
<ContentProvider value={data}>
  <ArrayContent>
    {/* provides each item via context */}
    <FieldContent field="price">
      <NumberFormatter /> {/* gets value from context */}
    </FieldContent>
  </ArrayContent>
</ContentProvider>
```

Child components access data through hooks:

```tsx
function NumberFormatter() {
  const value = useContent<number>(); // gets value from nearest context
  return <>{formatNumber(value)}</>;
}
```

## Key Characteristics

### 1. **Reusable Renderers**

Components that consume context work anywhere without knowing the data source:

```tsx
function BooleanContent({ yes, no }) {
  const value = useContent<boolean>();
  return <>{value ? yes : no}</>;
}

// Works in any context that provides a boolean
<ContentProvider value={true}>
  <BooleanContent yes="✓" no="✗" />
</ContentProvider>;
```

### 2. **Immutable Children & Performance**

Since data flows through context instead of props, React elements often have no changing props, making them **immutable**. This enables powerful optimizations:

```tsx
// Children can be memoized
const defaultChildren = <DefaultContent />;

function FieldContent({ field }) {
  const content = useContent();
  return (
    <ContentProvider value={content[field]}>
      {defaultChildren} {/* Same reference every render */}
    </ContentProvider>
  );
}

// Or memoized within the component
function ProductTable() {
  return useMemo(
    () => (
      <ArrayContent>
        <FieldContent field="price">
          <NumberContent />
        </FieldContent>
      </ArrayContent>
    ),
    [],
  );
}

// Or even moved outside the component
const content = (
  <ArrayContent>
    <FieldContent field="price">
      <NumberContent />
    </FieldContent>
  </ArrayContent>
);
// component
function ProductTable() {
  return content;
}
```

Immutable children help React's reconciliation algorithm skip unnecessary re-renders and comparisons.

### 3. **Default Children**

Components can provide sensible defaults, reducing boilerplate:

```tsx
// With default children
<AccessorContent accessor="user.address.city" />

// Equivalent to
<AccessorContent accessor="user.address.city">
  <DefaultContent />
</AccessorContent>

// Implementation
const defaultChildren = <DefaultContent />;
function AccessorContent({ accessor, children = defaultChildren }) {
  const content = useContent();
  return (
    <ContentProvider value={access(content, accessor)}>
      {children}
    </ContentProvider>
  );
}
```

This makes simple cases concise while keeping customization available.

### 4. **Open for Customization**

Default children create a pattern where components work out-of-the-box but remain fully customizable:

```tsx
// Default usage - simple and clean
<FieldContent field="price" />

// Custom rendering - override when needed
<FieldContent field="price">
  <FancyPriceDisplay />
</FieldContent>

// Complex composition - mix defaults and custom
<FieldContent field="metadata">
  <NullableContent nullContent="No data">
    <ObjectContent>
      <KeyContent />: <DefaultContent />
    </ObjectContent>
  </NullableContent>
</FieldContent>
```

This pattern balances **ease of use** (good defaults) with **flexibility** (full customization).

## Core Concepts

### ContentProvider & useContent

The foundation of micro-context:

```tsx
// Provide data via context
<ContentProvider value={someData}>
  <MyComponent />
</ContentProvider>;

// Consume data from context
function MyComponent() {
  const data = useContent();
  return <div>{data}</div>;
}
```

### Content Components

Components that transform data and provide it via context:

- **AccessorContent** - Extract data using path or function accessors
- **FieldContent** - Access object fields
- **ArrayContent** - Map arrays, providing each item via context
- **ObjectContent** - Iterate object keys, providing values via context
- **NullableContent** - Handle null/undefined values
- **DefaultContent** - Render primitive values

### Accessors

Extract values from data structures:

```tsx
// Path accessor - string-based
<AccessorContent accessor="user.address.city">
  <DefaultContent />
</AccessorContent>

// Function accessor
<AccessorContent accessor={(user) => user.fullName}>
  <DefaultContent />
</AccessorContent>
```

### Additional Contexts

Beyond value context, micro-contexts can provide metadata:

- **IndexContext** - Current index in array/object iteration
- **KeyContext** - Current key in object iteration

```tsx
<ArrayContent>
  <IndexContent /> {/* renders 0, 1, 2... */}
  <DefaultContent />
</ArrayContent>
```

## Real-World Example

Building a table with micro-context (using `@ctablex/table`, which is built on `@ctablex/core`):

```tsx
<DataTable data={products}>
  <Columns>
    <Column header="Name" accessor="name" />
    <Column header="Free Delivery" accessor="freeDelivery">
      <BooleanContent yes="Yes" no="No" />
    </Column>
    <Column header="Price" accessor="price">
      <NumberContent />
    </Column>
  </Columns>
  <Table />
</DataTable>
```

Data flow:

1. `DataTable` provides `products` array via context
2. `Table` iterates rows, providing each product via context
3. `Column` uses accessor to extract field, provides it via context
4. `BooleanContent`/`NumberContent` consume from context and render

## Benefits

### Decoupled Components

Children don't need to know parent props or data structure:

```tsx
// This component works anywhere
function PriceFormatter() {
  const price = useContent<number>();
  return <span>${price.toFixed(2)}</span>;
}
```

### Flexible Composition

Mix and match transformers and renderers:

```tsx
<AccessorContent accessor="items">
  <ArrayContent>
    <FieldContent field="price">
      <NullableContent nullContent="N/A">
        <PriceFormatter />
      </NullableContent>
    </FieldContent>
  </ArrayContent>
</AccessorContent>
```

## Trade-offs and Limitations

### No Strong Type Safety

The biggest drawback of micro-context is the **lack of strong type safety**. While TypeScript can provide some validation, it requires manual intervention and is easily bypassed.

#### The Problem

**Generic types must be explicitly passed** to both content components and the `useContent` hook:

```tsx
type User = { name: string; address: { city: string } };
type Data = { user: User };
const data: Data = ...;

<ContentProvider value={data}>
  {/* Must pass generic type for field/accessor validation */}
  <FieldContent<Data> field="user">        {/* ✓ field is validated */}
    <FieldContent<User> field="name">      {/* ✓ field is validated */}
      <DefaultContent />
    </FieldContent>
  </FieldContent>
</ContentProvider>

// useContent also requires manual type annotation
function MyComponent() {
  const user = useContent<User>();  // ✗ Type is manual - no validation
  return <div>{user.name}</div>;
}

// Without generic type, TypeScript cannot validate fields
<FieldContent field="user">               {/* ✗ no type checking */}
  <FieldContent field="invalidField">     {/* ✗ no error! */}
    <DefaultContent />
  </FieldContent>
</FieldContent>

// Wrong generic type also won't show errors
<FieldContent<User> field="user">         {/* ✗ no error, but User is wrong type */}
  <FieldContent field="name">             {/* ✗ still no validation */}
    <DefaultContent />
  </FieldContent>
</FieldContent>
```

#### Why This Happens

- JSX elements cannot be validated at compile time to infer generics
- TypeScript cannot verify that the generic type matches the actual context value
- `useContent<T>()` type is purely manual - TypeScript cannot verify it matches context
- Type safety depends entirely on developer discipline

#### Implications

- **Runtime errors** - Typos in field names won't be caught at compile time
- **Refactoring risks** - Renaming fields may not update all references
- **Developer burden** - Must manually ensure type correctness throughout the component tree
- **Silent failures** - Wrong types compile successfully but fail at runtime
- **No autocomplete** - IDEs can't suggest valid field names without correct generics

### Comparison with Props

With traditional props, TypeScript provides strong guarantees:

```tsx
// Props approach - strong type safety
interface CellProps {
  value: number;
}
function Cell({ value }: CellProps) {
  return <>{value.toFixed(2)}</>; // ✓ TypeScript knows value is number
}

<Cell value={product.price} />; // ✓ TypeScript validates price is number

// Micro-context approach - weak type safety
function Cell() {
  const value = useContent<number>(); // ✗ Type is just a hint
  return <>{value.toFixed(2)}</>;
}

<ContentProvider value={product.price}>
  <Cell /> {/* ✗ No validation that price is actually number */}
</ContentProvider>;
```

## Micro vs Macro Context

| Aspect   | Macro-Context                   | Micro-Context                 |
| -------- | ------------------------------- | ----------------------------- |
| Scope    | Application-wide                | Component subtree             |
| Lifetime | Entire app lifecycle            | Component render              |
| Updates  | Infrequent, triggers re-renders | Frequent, localized           |
| Purpose  | Global state (theme, auth)      | Data transformation & flow    |
| Nesting  | Typically 1-2 levels            | Multiple nested levels        |
| Examples | ThemeProvider, AuthProvider     | ContentProvider, ArrayContent |

## When to Use Micro-Context

Micro-context excels when:

- Building **repetitive structures** (tables, lists, forms)
- Creating **reusable renderers** that work with different data
- **Transforming data** through multiple steps
- Avoiding **prop drilling** in component trees
- Enabling **composition** over configuration

Micro-context may be overkill for:

- Simple one-off components
- Flat data structures with no transformation
- Cases where explicit props are clearer

### When Type Safety Matters Most

Consider avoiding micro-context when:

- Working with complex, frequently-changing data structures
- Type safety is critical for correctness
- Team members are less familiar with the codebase
- Refactoring is frequent

The flexibility and composition benefits may not outweigh the loss of compile-time guarantees.

## Summary

Micro-context is a pattern for **localized, granular data flow** using React Context. By creating small, scoped providers within component trees, it enables:

- Data transformation without prop drilling
- Reusable components that consume from context
- Flexible composition of transformers and renderers

This approach unlocks powerful patterns for building flexible, composable UIs
while maintaining clean component boundaries. However, this flexibility comes
at the cost of weaker compile-time type safety compared to traditional props.
