# Array Content Components

Components for iterating over arrays and accessing array indices.

## ArrayContent

Iterates over an array, rendering children for each element. Provides both the array element and its index via context.

### Props

```tsx
interface ArrayContentProps<V> {
  getKey?: PathAccessorTo<V, string | number> | ArrayGetKey<V>;
  children?: ReactNode;
  join?: ReactNode;
  value?: ReadonlyArray<V>;
}

type ArrayGetKey<V> = (value: V, index: number) => string | number;
```

- **`getKey`** - Extracts a unique key from each element (optional, defaults to index)
  - Path string: `"id"` extracts the `id` property
  - Function: `(value, index) => value.id` for custom logic
- **`children`** - Content to render for each element (defaults to `<DefaultContent />`)
- **`join`** - Content to render between elements (e.g., commas, separators)
- **`value`** - Array to iterate (optional, uses context value if omitted)

### Behavior

- Iterates over the array from the content context
- Wraps each element in a `ContentProvider` with the element value
- Provides the array index via `IndexContext`
- Renders `join` content between elements (not before the first element)
- Uses `getKey` to generate React keys for list items

### Example

```tsx
import { ArrayContent, IndexContent } from '@ctablex/core';

type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// Basic iteration
<ContentProvider value={users}>
  <ArrayContent>
    <FieldContent field="name">
      <DefaultContent />
    </FieldContent>
  </ArrayContent>
</ContentProvider>
// Renders: AliceBob

// With separator
<ContentProvider value={users}>
  <ArrayContent join=", ">
    <FieldContent field="name">
      <DefaultContent />
    </FieldContent>
  </ArrayContent>
</ContentProvider>
// Renders: Alice, Bob

// With index
<ContentProvider value={users}>
  <ArrayContent getKey="id">
    <IndexContent start={1} />. <FieldContent field="name" />
  </ArrayContent>
</ContentProvider>
// Renders: 1. Alice2. Bob

// Custom key function
<ContentProvider value={users}>
  <ArrayContent getKey={(user, index) => `user-${user.id}`}>
    <FieldContent field="name">
      <div>
        <DefaultContent />
      </div>
    </FieldContent>
  </ArrayContent>
</ContentProvider>
// Renders: <div>Alice</div><div>Bob</div>
```

### Type Safety

The generic type `V` on `ArrayContent<V>` provides type safety for the `getKey` prop:

```tsx
// ✓ Type-safe getKey with autocomplete
<ArrayContent<User> getKey="id">  {/* ✓ Autocomplete suggests "id", "name" */}
  <div>...</div>
</ArrayContent>

// ✗ Compile error - invalid path
<ArrayContent<User> getKey="email">  {/* ✗ Error! "email" doesn't exist on User */}
  <div>...</div>
</ArrayContent>

// ✓ Type-safe function
<ArrayContent<User> getKey={(user, index) => user.id}>  {/* ✓ "user" is typed as User */}
  <div>...</div>
</ArrayContent>
```

However, **nested components are not automatically type-checked**:

```tsx
// ✗ No type checking - nested FieldContent doesn't inherit User type
<ArrayContent<User>>
  <FieldContent field="name">  {/* No error, but no autocomplete either */}
    <DefaultContent />
  </FieldContent>
</ArrayContent>

// ✓ Type-safe with explicit generic on FieldContent
<ArrayContent<User>>
  <FieldContent<User> field="name">  {/* ✓ "name" exists on User - autocomplete works! */}
    <DefaultContent />
  </FieldContent>
</ArrayContent>

// ✗ Compile error with explicit generic
<ArrayContent<User>>
  <FieldContent<User> field="email">  {/* ✗ Error! "email" doesn't exist on User */}
    <DefaultContent />
  </FieldContent>
</ArrayContent>
```

**Summary:**

- `ArrayContent<User>` generic provides type safety for `getKey` prop
- Nested components need their own explicit generic like `<FieldContent<User>>` for type checking

## IndexContent

Displays the current array index from `IndexContext`.

### Props

```tsx
interface IndexContentProps {
  start?: number;
}
```

- **`start`** - Offset to add to the index (optional, defaults to 0)

### Behavior

- Retrieves the current index from `IndexContext`
- Adds the `start` offset to the index
- Renders the resulting number

### Example

```tsx
const items = ['Apple', 'Banana', 'Cherry'];

// Zero-based index
<ContentProvider value={items}>
  <ArrayContent>
    <IndexContent />: <DefaultContent />
  </ArrayContent>
</ContentProvider>
// Renders: 0: Apple1: Banana2: Cherry

// One-based index
<ContentProvider value={items}>
  <ArrayContent>
    <IndexContent start={1} />. <DefaultContent />
  </ArrayContent>
</ContentProvider>
// Renders: 1. Apple2. Banana3. Cherry
```

### Error Handling

Throws an error if used outside `IndexContext`:

```tsx
// ✗ Error: useIndex must be used within a IndexContext
<IndexContent />
```

## IndexContext

React Context providing the current array index.

```tsx
const IndexContext: React.Context<number | undefined>;
function useIndex(): number;
```

### Behavior

- Automatically provided by `ArrayContent` and `ObjectContent`
- Contains the current iteration index
- `useIndex()` throws if context is undefined

### Example

```tsx
import { useIndex } from '@ctablex/core';

function CustomIndexDisplay() {
  const index = useIndex();
  return <span>Item #{index + 1}</span>;
}

<ContentProvider value={['A', 'B', 'C']}>
  <ArrayContent>
    <CustomIndexDisplay /> - <DefaultContent />
  </ArrayContent>
</ContentProvider>;
// Renders: Item #1 - AItem #2 - BItem #3 - C
```

## Related

- [ObjectContent](./ObjectContent.md) - Iterate over object properties
- [ContentContext](./ContentContext.md) - Content value context
- [Accessors](./Accessors.md) - Type-safe value extraction
- [Micro-Context Pattern](../MICRO-CONTEXT.md) - Pattern overview
