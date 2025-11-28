# Object Content Components

Components for iterating over object properties and accessing object keys.

## ObjectContent

Iterates over object properties, rendering children for each key-value pair. Provides the property value, key, and index via context.

### Props

```tsx
interface ObjectContentProps<V extends object> {
  getKey?: ObjectGetKey<V>;
  children: ReactNode;
  join?: ReactNode;
  value?: V;
}

type ObjectGetKey<V extends object> = <K extends keyof V>(
  value: V[K],
  key: K,
  index: number,
) => string | number;
```

- **`getKey`** - Generates a unique React key for each property (optional, defaults to property key)
- **`children`** - Content to render for each property (required)
- **`join`** - Content to render between properties (e.g., commas, separators)
- **`value`** - Object to iterate (optional, uses context value if omitted)

### Behavior

- Iterates over `Object.keys()` of the object from content context
- Wraps each property value in a `ContentProvider`
- Provides the property key via `KeyContext`
- Provides the iteration index via `IndexContext`
- Renders `join` content between properties (not before the first property)
- Uses `getKey` to generate React keys for list items (defaults to `key.toString()`)

### Example

```tsx
import { ObjectContent, KeyContent, IndexContent } from '@ctablex/core';

type Product = {
  name: string;
  price: number;
  stock: number;
};

const product: Product = {
  name: 'Widget',
  price: 99.99,
  stock: 50,
};

// Basic iteration
<ContentProvider value={product}>
  <ObjectContent>
    <KeyContent />: <DefaultContent />
  </ObjectContent>
</ContentProvider>
// Renders: name: Widgetprice: 99.99stock: 50

// With separator
<ContentProvider value={product}>
  <ObjectContent join=", ">
    <KeyContent />: <DefaultContent />
  </ObjectContent>
</ContentProvider>
// Renders: name: Widget, price: 99.99, stock: 50

// With index
<ContentProvider value={product}>
  <ObjectContent join={<br />}>
    <IndexContent start={1} />. <KeyContent />: <DefaultContent />
  </ObjectContent>
</ContentProvider>
// Renders:
// 1. name: Widget
// 2. price: 99.99
// 3. stock: 50

// Custom key function
<ContentProvider value={product}>
  <ObjectContent getKey={(value, key, index) => `prop-${index}`}>
    <KeyContent />: <DefaultContent />
  </ObjectContent>
</ContentProvider>
```

### Type Safety

The generic type `V` on `ObjectContent<V>` provides type safety for the `getKey` prop:

```tsx
type User = {
  name: string;
  age: number;
};

// ✓ Type-safe getKey function
<ObjectContent<User>
  getKey={(value, key, index) => {
    // value: string | number (union of User property types)
    // key: "name" | "age" (User keys)
    return `${String(key)}-${index}`;
  }}
>
  <KeyContent />: <DefaultContent />
</ObjectContent>;
```

However, **nested components do NOT receive type information** from `ObjectContent<User>`:

```tsx
// Generic on ObjectContent alone doesn't provide type checking for nested components
<ObjectContent<User>>
  <KeyContent /> {/* string | number | symbol - always this type */}
  <DefaultContent /> {/* any - no type information from ObjectContent<User> */}
</ObjectContent>
```

**Summary:**

- `ObjectContent<User>` generic provides type safety for `getKey` prop
- Nested components do NOT inherit the type - each needs its own explicit generic if type safety is needed

## KeyContent

Displays the current object property key from `KeyContext`.

### Props

None.

### Behavior

- Retrieves the current property key from `KeyContext`
- Renders the key as a string

### Example

```tsx
const user = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
};

<ContentProvider value={user}>
  <ObjectContent join={<br />}>
    <KeyContent />: <DefaultContent />
  </ObjectContent>
</ContentProvider>;
// Renders:
// firstName: John
// lastName: Doe
// age: 30
```

### Error Handling

Throws an error if used outside `KeyContext`:

```tsx
// ✗ Error: useKey must be used within a KeyContext
<KeyContent />
```

## KeyContext

React Context providing the current object property key.

```tsx
const KeyContext: React.Context<string | number | symbol | undefined>;
function useKey(): string | number | symbol;
```

### Behavior

- Automatically provided by `ObjectContent`
- Contains the current property key
- `useKey()` throws if context is undefined

### Example

```tsx
import { useKey } from '@ctablex/core';

function CustomKeyDisplay() {
  const key = useKey();
  return <strong>{String(key).toUpperCase()}</strong>;
}

const data = { name: 'Alice', age: 25 };

<ContentProvider value={data}>
  <ObjectContent join=", ">
    <CustomKeyDisplay />: <DefaultContent />
  </ObjectContent>
</ContentProvider>;
// Renders: NAME: Alice, AGE: 25
```

## IndexContext

The iteration index is also provided via `IndexContext` (see [ArrayContent](./ArrayContent.md#indexcontext)).

### Example

```tsx
const settings = {
  theme: 'dark',
  language: 'en',
  notifications: true,
};

<ContentProvider value={settings}>
  <ObjectContent join={<br />}>
    <IndexContent />: <KeyContent /> = <DefaultContent />
  </ObjectContent>
</ContentProvider>;
// Renders:
// 0: theme = dark
// 1: language = en
// 2: notifications = true
```

## Related

- [ArrayContent](./ArrayContent.md) - Iterate over arrays
- [ContentContext](./ContentContext.md) - Content value context
- [FieldContent](./Contents.md#fieldcontent) - Access single object field
- [Micro-Context Pattern](./MICRO-CONTEXT.md) - Pattern overview
