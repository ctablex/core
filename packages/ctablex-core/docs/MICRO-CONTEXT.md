# Micro-Context Pattern

## What is Micro-Context?

**Micro-context** is a pattern for passing data through localized React Context instead of props. Unlike traditional "macro-context" patterns (like theme providers or auth state that span entire applications), micro-context creates small, scoped context providers within component subtrees for fine-grained data flow.

This enables **declarative data transformation** with minimal manual prop passing—components describe what data they need, not how to pass it through every layer.

## The Problem It Solves

In traditional React patterns, data flows through props manually:

```tsx
<Table>
  {data.map((item) => (
    <Row>
      <Cell>
        <NumberFormatter value={item.price} />
      </Cell>
    </Row>
  ))}
</Table>
```

This leads to:

- **Prop drilling** - Every intermediate component must accept and pass props
- **Tight coupling** - Child components are explicitly bound to parent props
- **Limited composition** - Hard to create reusable renderers that work in different contexts

## The Micro-Context Solution

Instead of passing data as props, wrap it in a context provider, no data passed via props or manual iteration:

```tsx
<ContentProvider value={data}>
  <Table>
    {/* Iterates array, provides each item via context */}
    <ArrayContent>
      <Row>
        {/* Extracts "price" field, provides it via context */}
        <FieldContent field="price">
          <Cell>
            {/* Reads value from context */}
            <NumberFormatter />
          </Cell>
        </FieldContent>
      </Row>
    </ArrayContent>
  </Table>
</ContentProvider>
```

Notice that no props are passed through `Table`, `Row`, or `Cell`. Each component declares what data it needs, and micro-context handles the flow automatically. This enables powerful patterns for building flexible, composable components.

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
<ContentValue accessor="user.address.city" />

// Equivalent to
<ContentValue accessor="user.address.city">
  <DefaultContent />
</ContentValue>

// Implementation
const defaultChildren = <DefaultContent />;
function ContentValue({ accessor, children = defaultChildren }) {
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

- **ContentValue** - Extract data using path or function accessors
- **FieldContent** - Access object fields
- **ArrayContent** - Map arrays, providing each item via context
- **ObjectContent** - Iterate object keys, providing values via context
- **NullableContent** - Handle null/undefined values
- **DefaultContent** - Render primitive values

### Accessors

Extract values from data structures:

```tsx
// Path accessor - string-based
<ContentValue accessor="user.address.city">
  <DefaultContent />
</ContentValue>

// Function accessor
<ContentValue accessor={(user) => user.fullName}>
  <DefaultContent />
</ContentValue>
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

## Trade-offs and Limitations

### Weak Type Safety

The biggest drawback of micro-context is the **lack of strong type safety**. While TypeScript provides autocomplete and validation for props, it cannot enforce correctness across context boundaries.

#### How It Works

TypeScript type safety in ctablex has three key characteristics:

1. **Generic types on components are NOT validated** - You can pass wrong types without errors
2. **Props ARE validated based on the generic** - Given a type, props get autocomplete
3. **Nested components are NOT automatically typed** - Must add explicit generics to each

This means **generic types must be explicitly passed** to both content components and the `useContent` hook:

```tsx
type User = { name: string; address: { city: string } };

// ✓ Type-safe with explicit generic - field is validated and autocompleted
<FieldContent<User> field="name">
  <DefaultContent />
</FieldContent>

// ✗ No type checking without generic - any field accepted
<FieldContent field="invalidField">
  <DefaultContent />
</FieldContent>

// ✓ Nested components need their own generics
<ArrayContent<User> getKey="id">
  <FieldContent<User> field="name" />  {/* Must specify User again */}
</ArrayContent>

// useContent also requires manual type annotation
function MyComponent() {
  const user = useContent<User>();  // ✗ Type is just a hint - not validated
  return <div>{user.name}</div>;
}
```

#### Why This Happens

- **JSX elements types are erased at compile time** to `ReactElement<any, any>` so no type information flows to children
- **JSX elements cannot be validated at compile time** to infer or verify generics
- **TypeScript cannot verify that the generic type matches the actual context value**
- **`useContent<T>()` type is purely manual** - TypeScript cannot check it matches context
- **Type safety depends entirely on developer discipline**

#### Implications

- **Runtime errors** - Typos in field names won't be caught at compile time
- **Refactoring risks** - Renaming fields may not update all references
- **Developer burden** - Must manually ensure type correctness throughout the component tree
- **Silent failures** - Wrong types compile successfully but fail at runtime
- **No autocomplete without generics** - IDEs can't suggest valid field names

## When to Use Micro-Context

Micro-context excels when:

- Building **repetitive structures** (tables, lists)
- Creating **reusable renderers** that work with different data
- Providing **high customizability** - Components using micro-context enable flexible composition and customization

## Micro vs Macro Context

| Aspect   | Macro-Context                   | Micro-Context                 |
| -------- | ------------------------------- | ----------------------------- |
| Scope    | Application-wide                | Component subtree             |
| Lifetime | Entire app lifecycle            | Component render              |
| Updates  | Infrequent, triggers re-renders | Frequent, localized           |
| Purpose  | Global state (theme, auth)      | Data transformation & flow    |
| Nesting  | Typically 1-2 levels            | Multiple nested levels        |
| Examples | ThemeProvider, AuthProvider     | ContentProvider, ArrayContent |

## Summary

Micro-context is a pattern for **localized, granular data flow** using React Context. By creating small, scoped providers within component trees, it enables:

- Data transformation without prop drilling
- Reusable components that consume from context
- Flexible composition of transformers and renderers

This approach unlocks powerful patterns for building flexible, composable UIs while maintaining clean component boundaries. However, this flexibility comes at the cost of weaker compile-time type safety compared to traditional props.
