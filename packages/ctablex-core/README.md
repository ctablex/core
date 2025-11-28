# @ctablex/core

Core building blocks for composable, context-based React components using the **micro-context pattern**.

## What is Micro-Context?

**Micro-context** is a pattern for passing data through localized React Context instead of props. Unlike traditional context patterns that span entire applications, micro-context creates small, scoped providers within component subtrees for fine-grained data flow.

This enables:

- **Reusable components** that work anywhere without knowing the data source
- **Flexible composition** of data transformers and renderers
- **No prop drilling** through intermediate components
- **Immutable children** for better performance optimization

## Installation

```bash
npm install @ctablex/core
```

## Quick Start

```tsx
import { ContentProvider, FieldContent, DefaultContent } from '@ctablex/core';

type User = {
  name: string;
  email: string;
};

const user: User = {
  name: 'Alice',
  email: 'alice@example.com',
};

// Provide data via context
<ContentProvider value={user}>
  {/* Access fields without props */}
  <FieldContent field="name">
    <DefaultContent />
  </FieldContent>
</ContentProvider>;
// Renders: Alice
```

## Core Concepts

### ContentProvider & useContent

The foundation of micro-context:

```tsx
import { ContentProvider, useContent } from '@ctablex/core';

// Provide data
<ContentProvider value={someData}>
  <MyComponent />
</ContentProvider>;

// Consume data
function MyComponent() {
  const data = useContent();
  return <div>{data}</div>;
}
```

### Content Components

Transform and access data through context:

```tsx
import {
  AccessorContent,
  FieldContent,
  ArrayContent,
  ObjectContent,
  NullableContent,
  DefaultContent,
} from '@ctablex/core';

// Access nested paths
<AccessorContent accessor="user.address.city">
  <DefaultContent />
</AccessorContent>

// Access object fields
<FieldContent field="price">
  <DefaultContent />
</FieldContent>

// Iterate arrays
<ContentProvider value={users}>
  <ArrayContent getKey="id">
    <FieldContent field="name">
      <DefaultContent />
    </FieldContent>
  </ArrayContent>
</ContentProvider>

// Iterate objects
<ContentProvider value={product}>
  <ObjectContent join=", ">
    <KeyContent />: <DefaultContent />
  </ObjectContent>
</ContentProvider>

// Handle null/undefined
<FieldContent field="email">
  <NullableContent nullContent="No email">
    <DefaultContent />
  </NullableContent>
</FieldContent>
```

### Type-Safe Accessors

Extract values with strong TypeScript support:

```tsx
import { accessByPath, access } from '@ctablex/core';

type User = {
  profile: {
    name: string;
  };
};

const user: User = { profile: { name: 'Bob' } };

// Path accessor with autocomplete
const name = accessByPath(user, 'profile.name'); // ✓ Type-safe

// Function accessor
const value = access(user, (u) => u.profile.name); // ✓ Type inference
```

## Key Features

### Reusable Renderers

Components work anywhere without knowing the data source:

```tsx
function PriceDisplay() {
  const price = useContent<number>();
  return <span>${price.toFixed(2)}</span>;
}

// Works in any context that provides a number
<ContentProvider value={99.99}>
  <PriceDisplay />
</ContentProvider>;
```

### Default Children

Components provide sensible defaults while remaining customizable:

```tsx
// Simple - uses DefaultContent
<FieldContent field="price" />

// Custom rendering
<FieldContent field="price">
  <PriceDisplay />
</FieldContent>
```

### Performance Optimization

Immutable children enable powerful memoization:

```tsx
const content = (
  <ArrayContent>
    <FieldContent field="name">
      <DefaultContent />
    </FieldContent>
  </ArrayContent>
);

function ProductList() {
  return content; // Same reference every render
}
```

## Type Safety

⚠️ **Important:** Generic types must be explicitly provided for type checking and autocomplete:

```tsx
// ✓ Type-safe with explicit generic
<FieldContent<User> field="name">
  <DefaultContent />
</FieldContent>

// ✗ No type checking without generic
<FieldContent field="name">
  <DefaultContent />
</FieldContent>

// ✓ Accessor props are validated based on generic
<AccessorContent<User> accessor="profile.name">
  <DefaultContent />
</AccessorContent>
```

**Note:** Nested components do NOT inherit types automatically - each needs its own explicit generic for type safety.

## Documentation

For detailed documentation, common patterns, and pitfalls, see:

- **[Documentation Guide](./docs/README.md)** - Start here for a complete overview
- **[Micro-Context Pattern](./docs/MICRO-CONTEXT.md)** - Understand the core concept
- **[ContentContext](./docs/ContentContext.md)** - ContentProvider, useContent, ContentContext
- **[Contents](./docs/Contents.md)** - AccessorContent, FieldContent, NullableContent, DefaultContent
- **[ArrayContent](./docs/ArrayContent.md)** - Array iteration components
- **[ObjectContent](./docs/ObjectContent.md)** - Object iteration components
- **[Accessors](./docs/Accessors.md)** - Type-safe value extraction

## License

MIT

## Related Packages

- **[@ctablex/table](https://www.npmjs.com/package/@ctablex/table)** - Composable table components built on @ctablex/core
