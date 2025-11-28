# Accessors

Accessors are functions that extract values from data structures with **strong TypeScript support**. Unlike the weak type safety of generic context parameters, accessors provide **autocomplete and compile-time error detection**.

## Overview

The accessor system provides three types of accessors:

- **Path Accessors** - String-based paths like `"user.address.city"`
- **Function Accessors** - Custom extraction functions like `(user) => user.fullName`
- **Unified Accessors** - Accept either path strings, functions, `undefined`, or `null`

## Path Accessors

### accessByPath

Accesses nested properties using a dot-separated string path with **full type safety and autocomplete**.

```tsx
function accessByPath<T, K extends PathAccessor<T>>(
  t: T,
  path: K,
): PathAccessorValue<T, K>;
```

#### Example

```tsx
import { accessByPath } from '@ctablex/core';

type User = {
  name: string;
  address: {
    city: string;
    zip: number;
  };
};

const user: User = {
  name: 'John',
  address: { city: 'NYC', zip: 10001 },
};

// ✓ Type-safe with autocomplete
const city = accessByPath(user, 'address.city'); // string
const zip = accessByPath(user, 'address.zip'); // number

// ✓ Compile-time error for invalid paths
const invalid = accessByPath(user, 'address.country'); // ✗ Error!
const typo = accessByPath(user, 'addres.city'); // ✗ Error!
```

#### Type Safety

- **Autocomplete** - IDE suggests valid paths: `"name"`, `"address"`, `"address.city"`, `"address.zip"`
- **Compile-time errors** - Invalid paths are caught during development
- **Return type inference** - TypeScript knows `accessByPath(user, 'address.city')` returns `string`

### accessByPathTo

Like `accessByPath`, but constrains paths to those that return a specific type.

```tsx
function accessByPathTo<R, T, K extends PathAccessorTo<T, R>>(
  t: T,
  path: K,
): R & PathAccessorValue<T, K>;
```

#### Example

```tsx
type Product = {
  name: string;
  price: number;
  inStock: boolean;
  metadata: {
    weight: number;
    sku: string;
  };
};

const product: Product = {
  name: 'Widget',
  price: 99.99,
  inStock: true,
  metadata: { weight: 1.5, sku: 'WDG-001' },
};

// ✓ Explicit type arguments (R, T)
const price1 = accessByPathTo<number, Product>(product, 'price'); // ✓
const weight1 = accessByPathTo<number, Product>(product, 'metadata.weight'); // ✓

// ✓ Type inference from variable annotation
const price2: number = accessByPathTo(product, 'price'); // ✓
const weight2: number = accessByPathTo(product, 'metadata.weight'); // ✓

// ✗ Compile error - these paths don't return numbers
const name: number = accessByPathTo(product, 'name'); // ✗ Error! 'name' is not a number path
const stock: number = accessByPathTo(product, 'inStock'); // ✗ Error! 'inStock' is not a number path

// ✗ Type mismatch - path returns string, not number
const sku: number = accessByPath(product, 'metadata.sku'); // ✗ Error! Type 'string' is not assignable to 'number'
```

**Use case:** Ensuring extracted values match an expected type, useful for components that require specific value types.

### PathAccessor Type

The string literal type representing valid paths through an object structure.

```tsx
type PathAccessor<T, TDepth extends any[] = []> = /* ... */;
```

Supports:

- Object properties: `"user"`, `"user.name"`
- Nested paths: `"user.address.city"` (up to 5 levels deep)
- Array indices for tuples: `tuple.0`, `tuple.1`

### PathAccessorValue Type

The type of the value at a given path in an object.

```tsx
type PathAccessorValue<T, TProp> = /* ... */;
```

Computes the type of the value accessed by a path. Used internally by `accessByPath` to infer return types.

#### Example

```tsx
type User = {
  name: string;
  address: {
    city: string;
    zip: number;
  };
};

type Name = PathAccessorValue<User, 'name'>; // string
type City = PathAccessorValue<User, 'address.city'>; // string
type Zip = PathAccessorValue<User, 'address.zip'>; // number
```

### PathAccessorTo Type

The string literal type representing paths that return a specific type.

```tsx
type PathAccessorTo<T, R> = /* ... */;
```

Filters `PathAccessor<T>` to only include paths where `PathAccessorValue<T, K>` extends `R`.

#### Example

```tsx
type Product = {
  name: string;
  price: number;
  metadata: {
    weight: number;
    sku: string;
  };
};

// Only paths that return numbers
type NumberPaths = PathAccessorTo<Product, number>;
// Result: "price" | "metadata.weight"

// Only paths that return strings
type StringPaths = PathAccessorTo<Product, string>;
// Result: "name" | "metadata.sku"
```

## Function Accessors

### accessByFn

Accesses values using a custom function with type inference.

```tsx
function accessByFn<T, F extends FnAccessor<T>>(
  obj: T,
  fn: F,
): FnAccessorValue<T, F>;
```

**Note:** This function is rarely used directly. Use the unified `access` function instead.

#### Example

```tsx
type User = {
  firstName: string;
  lastName: string;
};

const user: User = {
  firstName: 'John',
  lastName: 'Doe',
};

// Custom extraction
const fullName = accessByFn(user, (u) => `${u.firstName} ${u.lastName}`);
// Returns: "John Doe"

// Complex logic
const isJohn = accessByFn(user, (u) => u.firstName === 'John');
// Returns: true
```

### FnAccessor Type

A function that extracts a value from an object.

```tsx
type FnAccessor<T, R = any> = (t: T) => R;
```

### FnAccessorValue Type

The return type of a function accessor.

```tsx
type FnAccessorValue<T, F extends FnAccessor<T>> = /* ... */;
```

Infers the return type of a function accessor. Used internally by `accessByFn` to determine return types.

#### Example

```tsx
type User = {
  firstName: string;
  lastName: string;
};

type FullNameFn = (u: User) => string;
type FullNameValue = FnAccessorValue<User, FullNameFn>; // string

type IsAdultFn = (u: User) => boolean;
type IsAdultValue = FnAccessorValue<User, IsAdultFn>; // boolean
```

## Unified Accessors

### access

The main accessor function that accepts **path strings, functions, `undefined`, or `null`**.

```tsx
function access<T, A extends Accessor<T>>(t: T, a: A): AccessorValue<T, A>;
```

#### Behavior

- **`undefined`** - Returns the input value unchanged
- **`null`** - Returns `null`
- **String** - Uses `accessByPath`
- **Function** - Calls the function with the input value

#### Example

```tsx
import { access } from '@ctablex/core';

type User = {
  name: string;
  age: number;
};

const user: User = { name: 'Alice', age: 30 };

// Path accessor
access(user, 'name'); // "Alice"

// Function accessor
access(user, (u) => u.age > 18); // true

// Undefined - returns input
access(user, undefined); // { name: 'Alice', age: 30 }

// Null - returns null
access(user, null); // null
```

### accessTo

Like `access`, but constrains to accessors that return a specific type.

```tsx
function accessTo<R, T, A extends AccessorTo<T, R>>(
  t: T,
  a: A,
): R & AccessorValue<T, A>;
```

#### Example

```tsx
type Product = {
  name: string;
  price: number;
  tags: string[];
};

const product: Product = {
  name: 'Widget',
  price: 99.99,
  tags: ['electronics', 'gadget'],
};

// ✓ Explicit type arguments (R, T)
const price1 = accessTo<number, Product>(product, 'price'); // 99.99
const doubled1 = accessTo<number, Product>(product, (p) => p.price * 2); // 199.98

// ✓ Type inference from variable annotation
const price2: number = accessTo(product, 'price'); // 99.99
const doubled2: number = accessTo(product, (p) => p.price * 2); // 199.98
const length: number = accessTo(product, (p) => p.tags.length); // 2

// ✗ Compile error - accessor doesn't return number
const name1: number = accessTo(product, 'name'); // ✗ Error! 'name' is not a number path
const tags: number = accessTo(product, (p) => p.tags); // ✗ Error! Returns string[], not number

// ✗ Type mismatch - path returns string, not number
const name2: number = access(product, 'name'); // ✗ Error! Type 'string' is not assignable to 'number'
```

### Accessor Type

Union type accepting all accessor types.

```tsx
type Accessor<T> = undefined | null | PathAccessor<T> | FnAccessor<T>;
```

### AccessorValue Type

The type of the value returned by an accessor.

```tsx
type AccessorValue<T, A extends Accessor<T>> = A extends undefined
  ? T
  : A extends null
    ? null
    : A extends PathAccessor<T>
      ? PathAccessorValue<T, A>
      : A extends FnAccessor<T>
        ? FnAccessorValue<T, A>
        : never;
```

Computes the return type of the `access` function based on the accessor type:

- `undefined` → returns `T` (the input)
- `null` → returns `null`
- Path string → returns `PathAccessorValue<T, A>`
- Function → returns `FnAccessorValue<T, A>`

#### Example

```tsx
type User = {
  name: string;
  age: number;
};

type Value1 = AccessorValue<User, undefined>; // User
type Value2 = AccessorValue<User, null>; // null
type Value3 = AccessorValue<User, 'name'>; // string
type Value4 = AccessorValue<User, (u: User) => boolean>; // boolean
```

### AccessorTo Type

Union type accepting accessors that return a specific type.

```tsx
type AccessorTo<T, R = any> =
  | undefined
  | null
  | PathAccessorTo<T, R>
  | FnAccessor<T, R>;
```

Like `Accessor<T>`, but constrains path accessors to those that return type `R`, and function accessors to those with return type `R`.

#### Example

```tsx
type Product = {
  name: string;
  price: number;
  metadata: {
    weight: number;
    sku: string;
  };
};

// Accepts any accessor that returns a number
type NumberAccessor = AccessorTo<Product, number>;

// Valid number accessors:
const accessor1: NumberAccessor = 'price'; // ✓ Path to number
const accessor2: NumberAccessor = 'metadata.weight'; // ✓ Path to number
const accessor3: NumberAccessor = (p) => p.price * 2; // ✓ Function returning number
const accessor4: NumberAccessor = undefined; // ✓ Returns Product (any)
const accessor5: NumberAccessor = null; // ✓ Returns null

// Invalid - don't return numbers:
const accessor6: NumberAccessor = 'name'; // ✗ Error! Path to string
const accessor7: NumberAccessor = (p) => p.name; // ✗ Error! Function returns string
```

## Type Safety Advantages

Accessors have **strong type safety** compared to generic context parameters:

### Path Accessors

```tsx
type User = {
  address: {
    city: string;
  };
};

// ✓ Autocomplete suggests: "address", "address.city"
accessByPath(user, 'address.city');

// ✗ Compile-time error
accessByPath(user, 'address.country'); // Property 'country' does not exist
accessByPath(user, 'addres.city'); // Property 'addres' does not exist
```

### Function Accessors

```tsx
// ✓ Full type inference
access(user, (u) => u.address.city);  // TypeScript knows return type is string

// ✓ Autocomplete works inside function
access(user, (u) => u./* autocomplete shows: address */);
```

### Compared to Generic Context

Accessors provide validation **based on the provided generic type**, while context generics themselves are not validated:

```tsx
type User = {
  address: {
    city: string;
  };
};

// ✗ Weak type safety - generic type itself is not validated
const city = useContent<User>();  // TypeScript cannot verify User matches actual context value

// ✓ Strong type safety - accessor IS validated based on generic type
<AccessorContent<User> accessor="address.city">  {/* ✓ TypeScript validates "address.city" exists on User */}
  <DefaultContent />
</AccessorContent>

<AccessorContent<User> accessor="address.country">  {/* ✗ Error! "country" doesn't exist on User */}
  <DefaultContent />
</AccessorContent>
```

**Key difference:**

- Generic type `<User>` on context is not validated by TypeScript (you could pass wrong type)
- But **given** that generic type, the `accessor` prop is fully validated with autocomplete
- This provides partial type safety: accessors are validated, but the generic type itself is not

## Limitations

### Path Depth

Path accessors support up to **5 levels of nesting**:

```tsx
// ✓ Supported
'a.b.c.d.e';

// ✗ Not supported
'a.b.c.d.e.f'; // Too deep
```

### Arrays

Path accessors work with **tuple types** but not generic arrays:

```tsx
type Tuple = [string, number];
const tuple: Tuple = ['hello', 42];

// ✓ Works with tuples
accessByPath(tuple, '0'); // "hello"
accessByPath(tuple, '1'); // 42

// ✗ Generic arrays require function accessors
type StringArray = string[];
const arr: StringArray = ['a', 'b', 'c'];
access(arr, (a) => a[0]); // Use function instead
```

## Usage with Content Components

Accessors are commonly used with `AccessorContent` and other content components:

```tsx
import { AccessorContent, FieldContent } from '@ctablex/core';

type User = {
  profile: {
    name: string;
    age: number;
  };
};

// Path accessor
<AccessorContent<User> accessor="profile.name">
  <DefaultContent />
</AccessorContent>

// Function accessor
<AccessorContent<User> accessor={(user) => user.profile.age > 18}>
  <BooleanContent yes="Adult" no="Minor" />
</AccessorContent>

// Undefined accessor (returns whole object)
<AccessorContent<User> accessor={undefined}>
  <ObjectContent>...</ObjectContent>
</AccessorContent>
```

## Related

- [AccessorContent](./AccessorContent.md) - Component using accessors
- [FieldContent](./FieldContent.md) - Simplified object field access
- [Content Context](./ContentContext.md) - Context system foundation
- [Micro-Context Pattern](../MICRO-CONTEXT.md) - Pattern overview
