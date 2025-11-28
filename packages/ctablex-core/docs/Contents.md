# Content Components

Utility components for accessing fields, transforming values, and handling null/undefined.

## AccessorContent

Transforms the content value using an accessor (path, function, undefined, or null), then provides the result to children.

### Props

```tsx
interface AccessorContentProps<V> {
  accessor: Accessor<V>;
  children?: ReactNode;
  value?: V;
}
```

- **`accessor`** - Accessor to apply to the content value
  - Path string: `"user.address.city"`
  - Function: `(value) => value.computed`
  - `undefined`: Returns value unchanged
  - `null`: Returns null
- **`children`** - Content to render with transformed value (defaults to `<DefaultContent />`)
- **`value`** - Input value to transform (optional, uses context value if omitted)

### Behavior

- Retrieves the content value from context (or uses `value` prop)
- Applies the accessor to transform the value
- Provides the transformed value to children via a new `ContentProvider`

### Example

```tsx
import { AccessorContent, DefaultContent } from '@ctablex/core';

type User = {
  profile: {
    name: string;
    age: number;
  };
  isActive: boolean;
};

const user: User = {
  profile: { name: 'Alice', age: 30 },
  isActive: true,
};

// Path accessor
<ContentProvider value={user}>
  <AccessorContent accessor="profile.name">
    <DefaultContent /> {/* Renders: Alice */}
  </AccessorContent>
</ContentProvider>

// Function accessor
<ContentProvider value={user}>
  <AccessorContent accessor={(u) => u.profile.age > 18}>
    <DefaultContent /> {/* Renders: true */}
  </AccessorContent>
</ContentProvider>

// Undefined accessor (returns unchanged)
<ContentProvider value={user}>
  <AccessorContent accessor={undefined}>
    <FieldContent field="isActive">
      <DefaultContent /> {/* Renders: true */}
    </FieldContent>
  </AccessorContent>
</ContentProvider>

// Null accessor
<ContentProvider value={user}>
  <AccessorContent accessor={null}>
    <NullableContent nullContent="No value">
      <DefaultContent />
    </NullableContent>
  </AccessorContent>
</ContentProvider>
// Renders: No value
```

### Type Safety

The `accessor` prop is validated based on the generic type:

```tsx
type Product = {
  name: string;
  price: number;
  metadata: {
    weight: number;
  };
};

// ✓ Type-safe paths with autocomplete
<AccessorContent<Product> accessor="metadata.weight">
  <DefaultContent />
</AccessorContent>

// ✗ Compile error - invalid path
<AccessorContent<Product> accessor="metadata.height">
  <DefaultContent />
</AccessorContent>

// ✓ Type-safe function
<AccessorContent<Product> accessor={(p) => p.price * 1.1}>
  <DefaultContent />
</AccessorContent>
```

**Note:** The generic type `<Product>` itself is not validated by TypeScript (you could pass the wrong type), but **given** that type, the `accessor` prop is fully validated with autocomplete.

## FieldContent

Accesses a single field of an object and provides its value to children. Simplified version of `AccessorContent` for object properties.

### Props

```tsx
interface FieldContentProps<V> {
  field: keyof V;
  children?: ReactNode;
}
```

- **`field`** - The object property to access
- **`children`** - Content to render with field value (defaults to `<DefaultContent />`)

### Behavior

- Retrieves the content value from context
- Accesses the specified field
- Provides the field value to children via a new `ContentProvider`

### Example

```tsx
import { FieldContent, DefaultContent } from '@ctablex/core';

type User = {
  name: string;
  email: string;
  age: number;
  address: {
    city: string;
  };
};

const user: User = {
  name: 'Bob',
  email: 'bob@example.com',
  age: 25,
  address: {
    city: 'New York',
  },
};

// Access single field
<ContentProvider value={user}>
  <FieldContent field="name">
    <DefaultContent /> {/* Renders: Bob */}
  </FieldContent>
</ContentProvider>

// Nested field access (field within field)
<ContentProvider value={user}>
  <FieldContent field="address">
    <FieldContent field="city">
      <DefaultContent /> {/* Renders: New York */}
    </FieldContent>
  </FieldContent>
</ContentProvider>

// Multiple fields
<ContentProvider value={user}>
  Name: <FieldContent field="name"><DefaultContent /></FieldContent>,
  Email: <FieldContent field="email"><DefaultContent /></FieldContent>
</ContentProvider>
// Renders: Name: Bob, Email: bob@example.com


// ✗ Common mistake - trying to nest fields from parent context
<ContentProvider value={user}>
  <FieldContent field="email">
    Name: <FieldContent field="name"><DefaultContent /></FieldContent>,
    Email: <DefaultContent />
  </FieldContent>
</ContentProvider>
// ✗ Error! "email" is a string, not an object with a "name" field
```

### Type Safety

The `field` prop is validated based on the generic type:

```tsx
type Product = {
  name: string;
  price: number;
};

// ✓ Valid field with autocomplete
<FieldContent<Product> field="name">
  <DefaultContent />
</FieldContent>

// ✗ Compile error - field doesn't exist
<FieldContent<Product> field="description">
  <DefaultContent />
</FieldContent>
```

**Note:** You must add the generic type `<Product>` to get type checking and autocomplete for the `field` prop. Without it, no validation occurs:

```tsx
// ✗ No type checking - accepts any string
<FieldContent field="anything">
  <DefaultContent />
</FieldContent>
```

### Comparison with AccessorContent

`FieldContent` is simpler but less flexible:

```tsx
// FieldContent - simple, direct property access
<FieldContent field="name">
  <DefaultContent />
</FieldContent>

// AccessorContent - more flexible, supports nested paths
<AccessorContent accessor="user.name">
  <DefaultContent />
</AccessorContent>
```

## NullableContent

Conditionally renders content based on whether the value is null or undefined.

### Props

```tsx
interface NullableContentProps {
  children?: ReactNode;
  nullContent?: ReactNode;
}
```

- **`children`** - Content to render when value is not null/undefined (defaults to `<DefaultContent />`)
- **`nullContent`** - Content to render when value is null/undefined (defaults to `null`)

### Behavior

- Retrieves the content value from context
- If value is `null` or `undefined`, renders `nullContent`
- Otherwise, renders `children`

### Example

```tsx
import { NullableContent, DefaultContent } from '@ctablex/core';

type User = {
  name: string;
  email?: string;
};

const user1: User = { name: 'Alice', email: 'alice@example.com' };
const user2: User = { name: 'Bob', email: undefined };

// With value
<ContentProvider value={user1}>
  <FieldContent field="email">
    <NullableContent nullContent="No email">
      <DefaultContent />
    </NullableContent>
  </FieldContent>
</ContentProvider>
// Renders: alice@example.com

// Without value
<ContentProvider value={user2}>
  <FieldContent field="email">
    <NullableContent nullContent="No email">
      <DefaultContent />
    </NullableContent>
  </FieldContent>
</ContentProvider>
// Renders: No email

// Default behavior (renders nothing for null)
<ContentProvider value={null}>
  <NullableContent>
    <DefaultContent />
  </NullableContent>
</ContentProvider>
// Renders: (nothing)
```

### Use Cases

- Display fallback text for missing optional fields
- Hide content when data is unavailable

## DefaultContent

Renders primitive values (string, number, null, undefined) directly.

### Props

None.

### Behavior

- Retrieves the content value from context
- Renders it directly (React's default behavior for primitives)
- Used as the default `children` for most content components
- **Only works with primitives** - objects and arrays of objects will cause React errors
- Arrays of primitives work fine

### Example

```tsx
import { DefaultContent } from '@ctablex/core';

// String
<ContentProvider value="Hello">
  <DefaultContent /> {/* Renders: Hello */}
</ContentProvider>

// Number
<ContentProvider value={42}>
  <DefaultContent /> {/* Renders: 42 */}
</ContentProvider>

// Boolean (renders nothing - React's default)
<ContentProvider value={true}>
  <DefaultContent /> {/* Renders: (nothing) */}
</ContentProvider>

// Null
<ContentProvider value={null}>
  <DefaultContent /> {/* Renders: (nothing) */}
</ContentProvider>

// ✗ Common mistake - objects cause React errors
<ContentProvider value={{ name: 'Alice' }}>
  <DefaultContent /> {/* ✗ Error: Objects are not valid as a React child */}
</ContentProvider>

// ✓ Use FieldContent or ObjectContent for objects
<ContentProvider value={{ name: 'Alice' }}>
  <FieldContent field="name">
    <DefaultContent />
  </FieldContent>
</ContentProvider>
```

### Default Usage

Most content components use `<DefaultContent />` as their default children:

```tsx
// These are equivalent:
<FieldContent field="name" />
<FieldContent field="name">
  <DefaultContent />
</FieldContent>

// Also equivalent:
<AccessorContent accessor="user.email" />
<AccessorContent accessor="user.email">
  <DefaultContent />
</AccessorContent>
```

### Common Pitfall

Many content components use `<DefaultContent />` as default children. This causes errors when the content value is an object or array of objects:

```tsx
// ✗ Error - ArrayContent provides array elements (objects) to DefaultContent
<ContentProvider value={[{ name: 'Alice' }, { name: 'Bob' }]}>
  <ArrayContent /> {/* Missing children - defaults to <DefaultContent /> */}
</ArrayContent>
// ✗ Error: Objects are not valid as a React child

// ✓ Provide explicit children for object/array content
<ContentProvider value={[{ name: 'Alice' }, { name: 'Bob' }]}>
  <ArrayContent>
    <FieldContent field="name">
      <DefaultContent />
    </FieldContent>
  </ArrayContent>
</ContentProvider>

// ✗ Error - FieldContent provides object value to DefaultContent
<ContentProvider value={{ address: { city: 'NYC' } }}>
  <FieldContent field="address" /> {/* Missing children - defaults to <DefaultContent /> */}
</FieldContent>
// ✗ Error: Objects are not valid as a React child

// ✓ Nest FieldContent or use ObjectContent
<ContentProvider value={{ address: { city: 'NYC' } }}>
  <FieldContent field="address">
    <FieldContent field="city">
      <DefaultContent />
    </FieldContent>
  </FieldContent>
</ContentProvider>
```

**Remember:** `<DefaultContent />` only works with primitives (string, number, boolean, null, undefined) or arrays of primitives. For objects and arrays, you must provide explicit children.

## Related

- [ArrayContent](./ArrayContent.md) - Iterate over arrays
- [ObjectContent](./ObjectContent.md) - Iterate over objects
- [ContentContext](./ContentContext.md) - Content value context
- [Accessors](./Accessors.md) - Type-safe value extraction
- [Micro-Context Pattern](../MICRO-CONTEXT.md) - Pattern overview
