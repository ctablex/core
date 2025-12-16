# Documentation Guide

Welcome to the ctablex-core documentation! This guide will help you navigate and understand the documentation structure.

## Quick Start

If you're new to ctablex, start here:

1. **[Micro-Context Pattern](./MICRO-CONTEXT.md)** - Understand the core concept behind ctablex
2. **[ContentContext](./ContentContext.md)** - Learn about the foundation: ContentProvider and useContent
3. **[Contents](./Contents.md)** - Explore basic content transformation components

## Documentation Structure

### Core Concepts

#### [Micro-Context Pattern](./MICRO-CONTEXT.md)

The fundamental pattern that ctablex is built on. Read this first to understand:

- What micro-context means (localized context vs app-wide context)
- Key characteristics: immutable children, default children, context nesting
- Benefits and trade-offs (especially type safety limitations)
- When to use this pattern

### Foundation

#### [ContentContext](./ContentContext.md)

The building blocks of the micro-context system:

- **ContentProvider** - Wraps values and provides them to children
- **useContent** - Hook to retrieve values from context
- **ContentContext** - Internal React Context (rarely used directly)

### Content Components

Components for transforming and accessing data:

#### [Contents](./Contents.md)

Utility components for common operations:

- **ContentValue** - Transform values using paths or functions
- **FieldContent** - Access object properties
- **NullableContent**, **NullContent** - Handle null/undefined values
- **DefaultContent** - Render primitive values

#### [ArrayContent](./ArrayContent.md)

Components for array iteration:

- **ArrayContent** - Iterate over arrays with index support
- **IndexContent** - Display current iteration index
- **IndexContext** - Context providing array index
- **EmptyContent**, **NonEmptyContent** - Conditional rendering based on array emptiness

#### [ObjectContent](./ObjectContent.md)

Components for object iteration:

- **ObjectContent** - Iterate over object properties
- **KeyContent** - Display current property key
- **KeyContext** - Context providing property key

### Type-Safe Data Access

#### [Accessors](./Accessors.md)

Strong type safety for value extraction:

- **Path Accessors** - `accessByPath`, `accessByPathTo` with autocomplete
- **Function Accessors** - `accessByFn` with type inference
- **Unified Accessors** - `access`, `accessTo` accepting any accessor type
- **Type Definitions** - `PathAccessor`, `Accessor`, and related types

## Common Patterns

### Basic Value Display

```tsx
<ContentProvider value={user}>
  <FieldContent field="name">
    <DefaultContent />
  </FieldContent>
</ContentProvider>
```

Start with: [Contents](./Contents.md#fieldcontent)

### Array Iteration

```tsx
<ContentProvider value={users}>
  <ArrayContent getKey="id">
    <FieldContent field="name">
      <DefaultContent />
    </FieldContent>
  </ArrayContent>
</ContentProvider>
```

Start with: [ArrayContent](./ArrayContent.md)

### Object Iteration

```tsx
<ContentProvider value={product}>
  <ObjectContent join=", ">
    <KeyContent />: <DefaultContent />
  </ObjectContent>
</ContentProvider>
```

Start with: [ObjectContent](./ObjectContent.md)

### Nested Path Access

```tsx
<ContentProvider value={user}>
  <ContentValue accessor="profile.address.city">
    <DefaultContent />
  </ContentValue>
</ContentProvider>
```

Start with: [Contents](./Contents.md#contentvalue) and [Accessors](./Accessors.md)

### Conditional Rendering

```tsx
<ContentProvider value={user}>
  <FieldContent field="email">
    <NullableContent nullContent="No email">
      <DefaultContent />
    </NullableContent>
  </FieldContent>
</ContentProvider>
```

Start with: [Contents](./Contents.md#nullablecontent)

## Type Safety Limitations

⚠️ Micro-context provides weak type safety. Generic types must be manually specified and cannot be validated across context boundaries. See [MICRO-CONTEXT.md - Weak Type Safety](./MICRO-CONTEXT.md#weak-type-safety) for details.

## Common Pitfalls

### useContent in JSX Children

**Problem:** Calling `useContent()` directly in JSX children runs in the **parent** component's context, not the nested one.

```tsx
// ✗ Wrong - useContent() runs in parent, gets wrong value
<FieldContent field="isActive">
  {useContent<boolean>() ? 'Yes' : 'No'}
</FieldContent>;

// ✓ Correct - create a separate component
function BooleanDisplay() {
  const value = useContent<boolean>();
  return <>{value ? 'Yes' : 'No'}</>;
}

<FieldContent field="isActive">
  <BooleanDisplay />
</FieldContent>;
```

**Why?** React evaluates JSX children before passing them to components. The `useContent()` call happens in the parent's render, not inside `FieldContent`.

Read more: [ContentContext - useContent](./ContentContext.md#usecontent)

### DefaultContent with Objects

**Problem:** DefaultContent only works with primitives (string, number, boolean, null, undefined).

```tsx
// ✗ Error - objects cause React errors
<ArrayContent />  {/* Defaults to <DefaultContent /> but elements are objects */}

// ✓ Provide explicit children
<ArrayContent>
  <FieldContent field="name">
    <DefaultContent />
  </FieldContent>
</ArrayContent>
```

Read more: [Contents - DefaultContent](./Contents.md#defaultcontent)

### Missing Generic Types

**Problem:** Forgetting to add generic types means no autocomplete or validation.

```tsx
// ✗ No type checking
<FieldContent field="anything" />

// ✓ Type checking with autocomplete
<FieldContent<User> field="name" />
```

Read more: Each component's Type Safety section

### Path Depth Limitation

**Problem:** Path accessors only support up to 5 levels of nesting.

```tsx
// ✗ Too deep
<ContentValue accessor="a.b.c.d.e.f" />

// ✓ Use function accessor instead
<ContentValue accessor={(obj) => obj.a.b.c.d.e.f} />
```

Read more: [Accessors - Limitations](./Accessors.md#limitations)

## Document Index

- **[MICRO-CONTEXT.md](./MICRO-CONTEXT.md)** - Core pattern explanation
- **[ContentContext.md](./ContentContext.md)** - ContentProvider, useContent, ContentContext
- **[Contents.md](./Contents.md)** - ContentValue, FieldContent, NullableContent, DefaultContent
- **[ArrayContent.md](./ArrayContent.md)** - ArrayContent, IndexContent, IndexContext
- **[ObjectContent.md](./ObjectContent.md)** - ObjectContent, KeyContent, KeyContext
- **[Accessors.md](./Accessors.md)** - All accessor functions and types

## Need Help?

1. **Getting Started** → Read [MICRO-CONTEXT.md](./MICRO-CONTEXT.md) first
2. **Basic Usage** → Check [ContentContext.md](./ContentContext.md) and [Contents.md](./Contents.md)
3. **Iteration** → See [ArrayContent.md](./ArrayContent.md) or [ObjectContent.md](./ObjectContent.md)
4. **Advanced Types** → Explore [Accessors.md](./Accessors.md)
5. **Type Safety Issues** → Review the Type Safety sections in each document
