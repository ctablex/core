# Content Context

The Content Context system provides the foundation for the micro-context pattern, enabling data flow through React Context instead of props. It consists of three parts that work together:

- **`ContentContext`** - The underlying React Context
- **`ContentProvider`** - Component to provide values via context
- **`useContent`** - Hook to consume values from context

## TL;DR

Use `<ContentProvider value={...}>` to provide any value and make it available to descendant components. Use `useContent` within those components to access the provided value. `useContent` can also accept an optional override value.

## Basic Usage

```tsx
import { ContentProvider, useContent } from '@ctablex/core';

function App() {
  const user = { name: 'John', age: 30 };

  return (
    <ContentProvider value={user}>
      <UserDisplay />
    </ContentProvider>
  );
}

function UserDisplay() {
  const user = useContent<{ name: string; age: number }>();
  return (
    <div>
      {user.name} is {user.age} years old
    </div>
  );
}
```

## ContentProvider

Wraps any value in a React Context, making it available to descendant components.

### Props

```tsx
interface ContentProviderProps<V> {
  value: V;
  children?: ReactNode;
}
```

#### `value`

**Type:** `V` (generic)

The data to provide via context. Can be any type - primitives, objects, arrays, etc.

```tsx
<ContentProvider value={42}>
  <NumberDisplay />
</ContentProvider>

<ContentProvider value={{ name: 'Alice' }}>
  <UserCard />
</ContentProvider>

<ContentProvider value={[1, 2, 3]}>
  <NumberList />
</ContentProvider>
```

#### `children`

**Type:** `ReactNode` (optional)

Components that will have access to the provided value via `useContent`.

### Nesting

Providers can be nested to create scoped contexts. Child providers override parent values:

```tsx
<ContentProvider value="outer">
  <Display /> {/* accesses "outer" */}
  <ContentProvider value="inner">
    <Display /> {/* accesses "inner" */}
  </ContentProvider>
  <Display /> {/* accesses "outer" */}
</ContentProvider>
```

This nesting is the core of micro-context's data transformation pattern:

```tsx
<ContentProvider value={user}>
  {/* user context */}
  <FieldContent field="address">
    {/* address context */}
    <FieldContent field="city">
      {/* city context */}
      <DefaultContent />
    </FieldContent>
  </FieldContent>
</ContentProvider>
```

### Performance

`ContentProvider` uses `useMemo` internally to prevent unnecessary re-renders when the same value reference is provided.

**Best practice:** Memoize or stabilize the `value` prop when possible:

```tsx
// ✗ Creates new object every render - triggers context updates
function App() {
  return <ContentProvider value={{ name: 'John' }}>...</ContentProvider>;
}

// ✓ Stable reference - no unnecessary updates
const user = { name: 'John' };
function App() {
  return <ContentProvider value={user}>...</ContentProvider>;
}

// ✓ Memoized when dependent on props/state
function App({ userId }) {
  const user = useMemo(() => getUser(userId), [userId]);
  return <ContentProvider value={user}>...</ContentProvider>;
}
```

## useContent

Retrieves the current value from the nearest `ContentProvider` in the component tree.

### Signature

```tsx
function useContent<V>(value?: V): V;
```

### Type Parameter

#### `V`

The expected type of the content value. **This is purely manual** - TypeScript cannot verify it matches the actual context value.

```tsx
// Type is a hint to TypeScript, not validated
const user = useContent<User>(); // ✗ No compile-time validation

// Wrong type compiles successfully
const user = useContent<WrongType>(); // ✗ No error!
```

### Parameter

#### `value` (optional)

**Type:** `V | undefined`

An optional override value. If provided, this value is returned instead of the context value.

```tsx
function Display({ value }: { value?: number }) {
  const content = useContent<number>(value);
  return <span>{content}</span>;
}

// Uses override value
<Display value={42} />

// Uses context value
<ContentProvider value={99}>
  <Display />  {/* Displays: 99 */}
</ContentProvider>
```

**Use case:** Allows components to work both standalone (with props) and within context.

### Error Handling

`useContent` throws an error if called outside a `ContentProvider`:

```tsx
function Component() {
  const value = useContent(); // ✗ Error: useContent must be used within a ContentContext
  return <div>{value}</div>;
}
```

**Exception:** If an override `value` parameter is provided, no error is thrown:

```tsx
function Component() {
  const value = useContent(42); // ✓ Returns 42, no context needed
  return <div>{value}</div>;
}
```

## ContentContext

The underlying React Context that powers `ContentProvider` and `useContent`.

**⚠️ Internal API:** `ContentContext` is an internal implementation detail and may change in future versions. Always prefer using `ContentProvider` and `useContent` in application code.

### Type

```tsx
type ContentContextType<V> = { value: V };

const ContentContext: React.Context<ContentContextType<any> | undefined>;
```

### When to Use Directly

**Most applications should use `ContentProvider` and `useContent` instead.** Direct context usage is only needed for advanced scenarios:

#### Optional Context Consumption

When you want to handle missing context gracefully without throwing an error:

```tsx
import { ContentContext } from '@ctablex/core';
import { useContext } from 'react';

function OptionalDisplay() {
  const context = useContext(ContentContext);

  if (!context) {
    return <div>No data provided</div>;
  }

  return <div>{context.value}</div>;
}
```

Compare with `useContent`, which throws an error when context is missing.

#### Custom Context Logic

When building your own abstractions:

```tsx
function useContentOrDefault<V>(defaultValue: V): V {
  const context = useContext(ContentContext);
  return context ? context.value : defaultValue;
}
```

#### Context Consumer Pattern

Legacy consumer pattern instead of hooks:

```tsx
<ContentContext.Consumer>
  {(context) => (context ? <div>{context.value}</div> : <div>No context</div>)}
</ContentContext.Consumer>
```

## Type Safety Limitations

### No Type Inference or Validation

The hook cannot infer the type from context, and TypeScript cannot verify that the type parameter matches the actual context value:

```tsx
type User = { name: string };

function Component() {
  // Must manually specify type - no inference
  const user = useContent<User>();
  return <div>{user.name}</div>;
}

// ✓ Correct usage
<ContentProvider value={{ name: 'Alice' }}>
  <Component />
</ContentProvider>

// ✗ Type mismatch, but compiles! Runtime error!
<ContentProvider value={123}>
  <Component />
</ContentProvider>
```

The problem is that `useContent<T>()` accepts any type parameter, and there's no way for TypeScript to validate it against the actual context value at compile time.

### Refactoring Risks

Renaming fields won't automatically update all usages. Manual verification is required throughout the component tree.

## Best Practices

### Always Specify Type Parameter

```tsx
// ✗ Avoid - type is `any`
const value = useContent();

// ✓ Better - explicit type
const value = useContent<number>();
```

### Use Close to Context Provider

The further `useContent` is from its provider, the harder it is to verify type correctness:

```tsx
// ✓ Easy to verify type
<ContentProvider value={user}>
  <UserDisplay />  {/* Uses useContent<User>() */}
</ContentProvider>

// ✗ Harder to track - many layers deep
<ContentProvider value={user}>
  <Layout>
    <Sidebar>
      <Widget>
        <UserDisplay />  {/* Uses useContent<???> - what type? */}
      </Widget>
    </Sidebar>
  </Layout>
</ContentProvider>
```

### Consider Using Override Parameter

For components that should work both with and without context:

```tsx
function Display({ price }: { price?: number }) {
  const value = useContent<number>(price);
  return <span>${value.toFixed(2)}</span>;
}

// Works standalone
<Display price={99} />

// Works with context
<ContentProvider value={99}>
  <Display />
</ContentProvider>
```

### Use High-Level APIs

Prefer `ContentProvider` and `useContent` over direct `ContentContext` usage. They provide better error messages, simpler API, and built-in optimizations.

## Examples

### Simple Value Display

```tsx
function PriceDisplay() {
  const price = useContent<number>();
  return <span>${price.toFixed(2)}</span>;
}

<ContentProvider value={99.99}>
  <PriceDisplay /> {/* Displays: $99.99 */}
</ContentProvider>;
```

### With Override Parameter

```tsx
function UserGreeting({ name }: { name?: string }) {
  const userName = useContent<string>(name);
  return <h1>Hello, {userName}!</h1>;
}

// Standalone with prop
<UserGreeting name="Alice" />

// With context
<ContentProvider value="Bob">
  <UserGreeting />
</ContentProvider>

// Context with override (override wins)
<ContentProvider value="Charlie">
  <UserGreeting name="Dave" />  {/* Uses "Dave", not "Charlie" */}
</ContentProvider>
```

## Related

- [Micro-Context Pattern](./MICRO-CONTEXT.md) - Pattern overview
- [FieldContent](./Contents.md#fieldcontent) - Access object fields
- [ArrayContent](./ArrayContent.md) - Map arrays
- [DefaultContent](./Contents.md#defaultcontent) - Render primitive values
