import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ContentProvider,
  useContent,
  DefaultContent,
  FieldContent,
  ContentValue,
  ArrayContent,
  ObjectContent,
  NullableContent,
  NullContent,
  EmptyContent,
  NonEmptyContent,
  IndexContent,
  KeyContent,
  useIndex,
  useKey,
  access,
  accessByPath,
  accessByPathTo,
  accessTo,
} from './index';

// PLAN:
//
// role: you are user of @ctablex/core
// you are allowed to read packages/ctablex-core/readme.md and packages/ctablex-core/docs/ and packages/ctablex-core/index.d.ts
// you read .d.ts file as this:
// ```
// /**
// some docs to read
// */
// export declare type Foo = /* blah blah blah */
// ```
// read types name and its tsdoc. but not complexity of type implementaion
// you are not allowed to read src or any other implementation
// as user of this lib read and understand how @ctablex/core lib usage is
// then
// based your understanding use every thing in this lib in user.test.ts
// you only allowed to import from index import {} from './index'
// add comment how user think/feel (i should do foo because bar) or (we should use baz?) or (why that prop doesn't have doc/or that doc is obvios no need to be there. or it was good to mention x)
// as user you only allowed to edit user.test.ts
//
// write your feeling as you go along

describe('user test - exploring @ctablex/core as a new user', () => {
  // Okay, so I read the README and it says this is about "micro-context pattern"
  // Let me start with the basics - ContentProvider and useContent

  describe('Basic ContentProvider and useContent', () => {
    it('should provide and consume simple values', () => {
      // From the README, I see ContentProvider wraps data and useContent retrieves it
      // This seems straightforward - just like React Context but simpler?

      const TestComponent = () => {
        const value = useContent<string>();
        return <div>{value}</div>;
      };

      const { container } = render(
        <ContentProvider value="Hello World">
          <TestComponent />
        </ContentProvider>
      );

      expect(container.textContent).toBe('Hello World');
      // Nice! This works as expected. Very simple API.
    });

    it('should work with objects', () => {
      // Let me try with an object like in the README example
      type User = {
        name: string;
        email: string;
      };

      const user: User = {
        name: 'Alice',
        email: 'alice@example.com',
      };

      const TestComponent = () => {
        const userData = useContent<User>();
        return (
          <div>
            {userData.name} - {userData.email}
          </div>
        );
      };

      const { container } = render(
        <ContentProvider value={user}>
          <TestComponent />
        </ContentProvider>
      );

      expect(container.textContent).toBe('Alice - alice@example.com');
      // Works great! But I wonder if there's a better way than manually accessing fields...
    });

    it('should support nested providers (scoped contexts)', () => {
      // The docs mention providers can be nested and child providers override parent values
      // Let me test this - it's important for understanding the "micro" part

      const TestComponent = () => {
        const value = useContent<string>();
        return <div data-testid="content">{value}</div>;
      };

      const { getAllByTestId } = render(
        <ContentProvider value="outer">
          <TestComponent />
          <ContentProvider value="inner">
            <TestComponent />
          </ContentProvider>
          <TestComponent />
        </ContentProvider>
      );

      const elements = getAllByTestId('content');
      expect(elements[0].textContent).toBe('outer');
      expect(elements[1].textContent).toBe('inner');
      expect(elements[2].textContent).toBe('outer');
      // Ah! So nested providers create scoped contexts. This is the "micro" part!
    });

    it('should support useContent with override value', () => {
      // I see useContent can take an optional value parameter
      // Hmm, when would I use this? Maybe for testing or default values?

      const TestComponent = ({ override }: { override?: string }) => {
        const value = useContent(override);
        return <div>{value}</div>;
      };

      const { container } = render(
        <ContentProvider value="from context">
          <TestComponent override="overridden" />
        </ContentProvider>
      );

      expect(container.textContent).toBe('overridden');
      // Interesting! The override takes precedence. Could be useful for flexibility.
    });
  });

  describe('DefaultContent - rendering primitives', () => {
    it('should render string values', () => {
      // DefaultContent is mentioned as the default children for most components
      // Let me see how it works with different primitive types

      const { container } = render(
        <ContentProvider value="Hello">
          <DefaultContent />
        </ContentProvider>
      );

      expect(container.textContent).toBe('Hello');
      // Simple! Just renders the primitive value directly
    });

    it('should render numbers', () => {
      const { container } = render(
        <ContentProvider value={42}>
          <DefaultContent />
        </ContentProvider>
      );

      expect(container.textContent).toBe('42');
      // Works as expected
    });

    it('should render null as empty', () => {
      const { container } = render(
        <ContentProvider value={null}>
          <DefaultContent />
        </ContentProvider>
      );

      expect(container.textContent).toBe('');
      // Makes sense - React doesn't render null
    });

    it('should render undefined as empty', () => {
      const { container } = render(
        <ContentProvider value={undefined}>
          <DefaultContent />
        </ContentProvider>
      );

      expect(container.textContent).toBe('');
      // Same as null - renders nothing
    });

    // Note to self: The docs warn that DefaultContent only works with primitives
    // Objects would cause React errors. Need to use FieldContent or other components for objects.
  });

  describe('FieldContent - accessing object properties', () => {
    it('should access a single field', () => {
      // Okay, so for objects I should use FieldContent instead of accessing manually
      // This is cleaner than my earlier test where I manually accessed user.name

      type User = {
        name: string;
        age: number;
      };

      const user: User = { name: 'Bob', age: 30 };

      const { container } = render(
        <ContentProvider value={user}>
          <FieldContent field="name">
            <DefaultContent />
          </FieldContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('Bob');
      // Nice! Much more declarative than manually accessing in a component
    });

    it('should work without explicit children (defaults to DefaultContent)', () => {
      // The docs say most components default to <DefaultContent />
      // Let me verify this shorthand works

      type User = { name: string };
      const user: User = { name: 'Charlie' };

      const { container } = render(
        <ContentProvider value={user}>
          <FieldContent field="name" />
        </ContentProvider>
      );

      expect(container.textContent).toBe('Charlie');
      // Perfect! Less verbose. I like this pattern.
    });

    it('should nest for deeper access', () => {
      // For nested objects, I should nest FieldContent components
      // This creates that "scoped context" pattern

      type User = {
        profile: {
          address: {
            city: string;
          };
        };
      };

      const user: User = {
        profile: {
          address: {
            city: 'NYC',
          },
        },
      };

      const { container } = render(
        <ContentProvider value={user}>
          <FieldContent field="profile">
            <FieldContent field="address">
              <FieldContent field="city">
                <DefaultContent />
              </FieldContent>
            </FieldContent>
          </FieldContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('NYC');
      // Hmm, this works but seems verbose for deep nesting...
      // I wonder if there's a better way? Let me check ContentValue...
    });
  });

  describe('ContentValue - flexible value transformation', () => {
    it('should access nested paths with string accessor', () => {
      // Ah! ContentValue with path strings - this is what I need for deep nesting!
      // The docs say it supports "user.address.city" style paths

      type User = {
        profile: {
          address: {
            city: string;
          };
        };
      };

      const user: User = {
        profile: {
          address: {
            city: 'NYC',
          },
        },
      };

      const { container } = render(
        <ContentProvider value={user}>
          <ContentValue accessor="profile.address.city">
            <DefaultContent />
          </ContentValue>
        </ContentProvider>
      );

      expect(container.textContent).toBe('NYC');
      // Much better! One component instead of three nested ones.
      // This is way more convenient for deep paths.
    });

    it('should work with function accessors', () => {
      // ContentValue also supports functions - useful for computed values

      type User = {
        firstName: string;
        lastName: string;
      };

      const user: User = {
        firstName: 'John',
        lastName: 'Doe',
      };

      // Hmm, I had to add type annotation (u: User) here
      // TypeScript couldn't infer it automatically from the ContentProvider
      // Would be nice if the type flowed through, but I understand why it doesn't
      // (ContentProvider is generic and the accessor is just a function parameter)
      const { container } = render(
        <ContentProvider value={user}>
          <ContentValue accessor={(u: User) => `${u.firstName} ${u.lastName}`}>
            <DefaultContent />
          </ContentValue>
        </ContentProvider>
      );

      expect(container.textContent).toBe('John Doe');
      // Excellent! This is great for transformations and computed values.
    });

    it('should handle undefined accessor (returns value unchanged)', () => {
      // The docs say undefined returns the input unchanged
      // Not sure when I'd explicitly use this, but good to know

      const { container } = render(
        <ContentProvider value="test">
          <ContentValue accessor={undefined}>
            <DefaultContent />
          </ContentValue>
        </ContentProvider>
      );

      expect(container.textContent).toBe('test');
      // Works as documented - passes through unchanged
    });

    it('should handle null accessor (returns null)', () => {
      // null accessor returns null - could be useful for conditionally showing nothing?

      const { container } = render(
        <ContentProvider value="test">
          <ContentValue accessor={null}>
            <DefaultContent />
          </ContentValue>
        </ContentProvider>
      );

      expect(container.textContent).toBe('');
      // Returns null, which renders as empty. Interesting edge case.
    });

    it('should work with value prop override', () => {
      // Like useContent, ContentValue can take a value prop
      // This could be useful for passing data directly without context

      type User = { name: string };
      const user: User = { name: 'Alice' };

      const { container } = render(
        <ContentValue accessor="name" value={user}>
          <DefaultContent />
        </ContentValue>
      );

      expect(container.textContent).toBe('Alice');
      // Nice! Can use it standalone without ContentProvider if needed.
    });
  });

  describe('ArrayContent - iterating arrays', () => {
    it('should iterate over simple arrays', () => {
      // Time to explore array iteration
      // ArrayContent seems like the go-to for rendering lists

      const numbers = [1, 2, 3];

      const { container } = render(
        <ContentProvider value={numbers}>
          <ArrayContent>
            <DefaultContent />
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('123');
      // Works! Each element is rendered. But no spacing...
    });

    it('should use join prop for separators', () => {
      // The join prop adds content between elements - like Array.join()

      const numbers = [1, 2, 3];

      const { container } = render(
        <ContentProvider value={numbers}>
          <ArrayContent join=", ">
            <DefaultContent />
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('1, 2, 3');
      // Perfect! Much more readable with separators.
    });

    it('should iterate arrays of objects', () => {
      // Most real use cases are arrays of objects
      // I need to nest FieldContent to access properties

      type User = {
        id: number;
        name: string;
      };

      const users: User[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      const { container } = render(
        <ContentProvider value={users}>
          <ArrayContent join=", ">
            <FieldContent field="name">
              <DefaultContent />
            </FieldContent>
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('Alice, Bob, Charlie');
      // Nice! The nesting makes sense - ArrayContent provides each object,
      // then FieldContent extracts the name.
    });

    it('should use getKey prop for React keys', () => {
      // getKey extracts unique keys - important for React list rendering
      // Can be a path string or function

      type User = {
        id: number;
        name: string;
      };

      const users: User[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      const { container } = render(
        <ContentProvider value={users}>
          <ArrayContent getKey="id">
            <FieldContent field="name">
              <DefaultContent />
            </FieldContent>
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('AliceBob');
      // Works! Using path string "id" for keys.
      // Can't easily verify the keys are correct in this test, but trust the docs.
    });

    it('should use getKey with function', () => {
      // Function version for more complex key logic

      type User = {
        id: number;
        name: string;
      };

      const users: User[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      // Again, need to annotate the type (user: User) in the getKey function
      // Same issue - type doesn't flow from ContentProvider to the callback
      // A bit verbose but at least it's explicit and type-safe
      const { container } = render(
        <ContentProvider value={users}>
          <ArrayContent getKey={(user: User, index) => `user-${user.id}-${index}`}>
            <FieldContent field="name">
              <DefaultContent />
            </FieldContent>
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('AliceBob');
      // Good! Function gives more control when needed.
    });

    it('should provide index via IndexContent', () => {
      // IndexContent displays the current array index
      // Useful for numbered lists

      const items = ['First', 'Second', 'Third'];

      const { container } = render(
        <ContentProvider value={items}>
          <ArrayContent join=" ">
            <IndexContent />: <DefaultContent />
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('0: First 1: Second 2: Third');
      // Zero-based indices. Makes sense for arrays.
    });

    it('should support start prop on IndexContent', () => {
      // start prop offsets the index - for 1-based lists

      const items = ['First', 'Second', 'Third'];

      const { container } = render(
        <ContentProvider value={items}>
          <ArrayContent join=" ">
            <IndexContent start={1} />. <DefaultContent />
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('1. First 2. Second 3. Third');
      // Perfect for human-readable numbered lists!
    });

    it('should support useIndex hook', () => {
      // Can also access index via hook for more flexibility

      const IndexDisplay = () => {
        const index = useIndex();
        const value = useContent<string>();
        return (
          <span>
            [{index}]: {value}
          </span>
        );
      };

      const items = ['A', 'B', 'C'];

      const { container } = render(
        <ContentProvider value={items}>
          <ArrayContent join=" ">
            <IndexDisplay />
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('[0]: A [1]: B [2]: C');
      // Nice! Hook gives more control in custom components.
    });

    it('should work with value prop override', () => {
      // ArrayContent can take array directly via value prop

      const items = [1, 2, 3];

      const { container } = render(
        <ArrayContent value={items} join="-">
          <DefaultContent />
        </ArrayContent>
      );

      expect(container.textContent).toBe('1-2-3');
      // Works without ContentProvider! Flexible.
    });
  });

  describe('ObjectContent - iterating object properties', () => {
    it('should iterate over object properties', () => {
      // ObjectContent for key-value iteration - like Object.entries()

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

      const { container } = render(
        <ContentProvider value={product}>
          <ObjectContent>
            <KeyContent />: <DefaultContent />
          </ObjectContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('name: Widgetprice: 99.99stock: 50');
      // KeyContent shows the property key, DefaultContent shows the value
      // Works but no spacing...
    });

    it('should use join prop for separators', () => {
      // Same join pattern as ArrayContent

      type Product = {
        name: string;
        price: number;
      };

      const product: Product = {
        name: 'Widget',
        price: 99.99,
      };

      const { container } = render(
        <ContentProvider value={product}>
          <ObjectContent join=", ">
            <KeyContent />: <DefaultContent />
          </ObjectContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('name: Widget, price: 99.99');
      // Much better with separators!
    });

    it('should provide key via useKey hook', () => {
      // useKey hook for accessing key in custom components

      const KeyValuePair = () => {
        const key = useKey();
        const value = useContent<any>();
        return (
          <div>
            {String(key)} = {String(value)}
          </div>
        );
      };

      type Config = {
        theme: string;
        debug: boolean;
      };

      const config: Config = {
        theme: 'dark',
        debug: true,
      };

      const { container } = render(
        <ContentProvider value={config}>
          <ObjectContent>
            <KeyValuePair />
          </ObjectContent>
        </ContentProvider>
      );

      expect(container.textContent).toContain('theme = dark');
      expect(container.textContent).toContain('debug = true');
      // useKey hook works great for custom components!
      // Note: Had to use String(value) to display booleans - React doesn't render them by default
    });

    it('should provide index via useIndex', () => {
      // ObjectContent also provides iteration index like ArrayContent

      const DisplayWithIndex = () => {
        const index = useIndex();
        const key = useKey();
        const value = useContent<any>();
        return (
          <span>
            {index}. {String(key)}: {value}
          </span>
        );
      };

      type Data = {
        a: string;
        b: string;
      };

      const data: Data = { a: 'first', b: 'second' };

      const { container } = render(
        <ContentProvider value={data}>
          <ObjectContent join=" ">
            <DisplayWithIndex />
          </ObjectContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('0. a: first 1. b: second');
      // Both index and key are available! Powerful combination.
    });

    it('should support custom getKey function', () => {
      // getKey for custom React key generation (not the property key)

      type Config = {
        option1: string;
        option2: string;
      };

      const config: Config = {
        option1: 'value1',
        option2: 'value2',
      };

      const { container } = render(
        <ContentProvider value={config}>
          <ObjectContent
            getKey={(value, key, index) => `config-${String(key)}-${index}`}
          >
            <KeyContent />: <DefaultContent />
          </ObjectContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('option1: value1option2: value2');
      // getKey customizes React keys but doesn't affect rendering
    });

    it('should work with value prop', () => {
      // Can use directly without ContentProvider

      type Settings = {
        x: number;
        y: number;
      };

      const settings: Settings = { x: 10, y: 20 };

      const { container } = render(
        <ObjectContent value={settings} join=", ">
          <KeyContent />: <DefaultContent />
        </ObjectContent>
      );

      expect(container.textContent).toBe('x: 10, y: 20');
      // Flexible! Works standalone.
    });
  });

  describe('NullableContent - handling null/undefined', () => {
    it('should render children when value is not null', () => {
      // NullableContent for handling optional values

      const { container } = render(
        <ContentProvider value="Hello">
          <NullableContent nullContent={<span>No value</span>}>
            <DefaultContent />
          </NullableContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('Hello');
      // Value exists, so children are rendered
    });

    it('should render nullContent when value is null', () => {
      const { container } = render(
        <ContentProvider value={null}>
          <NullableContent nullContent={<span>No value</span>}>
            <DefaultContent />
          </NullableContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('No value');
      // null triggers nullContent - very useful for optional fields!
    });

    it('should render nullContent when value is undefined', () => {
      const { container } = render(
        <ContentProvider value={undefined}>
          <NullableContent nullContent={<span>No value</span>}>
            <DefaultContent />
          </NullableContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('No value');
      // undefined also triggers nullContent - makes sense
    });

    it('should work with optional object fields', () => {
      // Real use case: optional email field

      type User = {
        name: string;
        email?: string;
      };

      const userWithEmail: User = {
        name: 'Alice',
        email: 'alice@example.com',
      };

      const userWithoutEmail: User = {
        name: 'Bob',
      };

      const EmailDisplay = ({ user }: { user: User }) => (
        <ContentProvider value={user}>
          <FieldContent field="email">
            <NullableContent nullContent="No email provided">
              <DefaultContent />
            </NullableContent>
          </FieldContent>
        </ContentProvider>
      );

      const { container: c1 } = render(<EmailDisplay user={userWithEmail} />);
      expect(c1.textContent).toBe('alice@example.com');

      const { container: c2 } = render(<EmailDisplay user={userWithoutEmail} />);
      expect(c2.textContent).toBe('No email provided');

      // Perfect! This pattern is super clean for optional fields.
    });
  });

  describe('NullContent - conditional rendering for nulls', () => {
    it('should render only when content is null or undefined', () => {
      // NullContent - opposite of NonEmptyContent?
      // Renders its children only when value IS null/undefined

      const { container: c1 } = render(
        <ContentProvider value={null}>
          <NullContent>
            <span>Value is null!</span>
          </NullContent>
        </ContentProvider>
      );

      expect(c1.textContent).toBe('Value is null!');

      const { container: c2 } = render(
        <ContentProvider value="something">
          <NullContent>
            <span>Value is null!</span>
          </NullContent>
        </ContentProvider>
      );

      expect(c2.textContent).toBe('');
      // Only renders when null/undefined - useful for conditional messages
    });
  });

  describe('EmptyContent and NonEmptyContent - handling empty values', () => {
    it('EmptyContent should render for empty arrays', () => {
      // EmptyContent for showing messages when data is empty

      const { container } = render(
        <ContentProvider value={[]}>
          <EmptyContent>
            <span>No items</span>
          </EmptyContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('No items');
      // Empty array triggers EmptyContent
    });

    it('EmptyContent should not render for non-empty arrays', () => {
      const { container } = render(
        <ContentProvider value={[1, 2, 3]}>
          <EmptyContent>
            <span>No items</span>
          </EmptyContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('');
      // Non-empty array doesn't render - correct!
    });

    it('EmptyContent should render for null', () => {
      const { container } = render(
        <ContentProvider value={null}>
          <EmptyContent>
            <span>No data</span>
          </EmptyContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('No data');
      // null is considered empty
    });

    it('EmptyContent should render for undefined', () => {
      const { container } = render(
        <ContentProvider value={undefined}>
          <EmptyContent>
            <span>No data</span>
          </EmptyContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('No data');
      // undefined is considered empty
    });

    it('EmptyContent should support custom isEmpty function', () => {
      // Custom isEmpty logic for other types

      const { container } = render(
        <ContentProvider value="">
          <EmptyContent isEmpty={(c) => c === ''}>
            <span>String is empty</span>
          </EmptyContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('String is empty');
      // Custom isEmpty works! Flexible for different empty conditions.
    });

    it('NonEmptyContent should be opposite of EmptyContent', () => {
      // NonEmptyContent renders when NOT empty

      const { container: c1 } = render(
        <ContentProvider value={[1, 2, 3]}>
          <NonEmptyContent>
            <span>Has items</span>
          </NonEmptyContent>
        </ContentProvider>
      );

      expect(c1.textContent).toBe('Has items');

      const { container: c2 } = render(
        <ContentProvider value={[]}>
          <NonEmptyContent>
            <span>Has items</span>
          </NonEmptyContent>
        </ContentProvider>
      );

      expect(c2.textContent).toBe('');
      // Perfect for showing content only when data exists
    });

    it('should combine EmptyContent with ArrayContent', () => {
      // Real use case: show list or "no items" message

      const ListDisplay = ({ items }: { items: string[] }) => (
        <ContentProvider value={items}>
          <EmptyContent>
            <p>No items to display</p>
          </EmptyContent>
          <NonEmptyContent>
            <ul>
              <ArrayContent>
                <li>
                  <DefaultContent />
                </li>
              </ArrayContent>
            </ul>
          </NonEmptyContent>
        </ContentProvider>
      );

      const { container: c1 } = render(<ListDisplay items={[]} />);
      expect(c1.textContent).toContain('No items to display');

      const { container: c2 } = render(<ListDisplay items={['A', 'B']} />);
      expect(c2.textContent).toContain('A');
      expect(c2.textContent).toContain('B');
      expect(c2.textContent).not.toContain('No items');

      // Excellent pattern! Clean way to handle empty states.
    });
  });

  describe('Accessor functions - type-safe value extraction', () => {
    // Now let's explore the accessor functions
    // These are for extracting values with TypeScript safety

    it('access() should work with path strings', () => {
      // access() is the main unified accessor function

      type User = {
        profile: {
          name: string;
        };
      };

      const user: User = {
        profile: {
          name: 'Alice',
        },
      };

      const name = access(user, 'profile.name');
      expect(name).toBe('Alice');
      // Simple path access - type-safe according to docs
    });

    it('access() should work with functions', () => {
      type User = {
        firstName: string;
        lastName: string;
      };

      const user: User = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const fullName = access(user, (u) => `${u.firstName} ${u.lastName}`);
      expect(fullName).toBe('John Doe');
      // Function accessor for transformations - very flexible
    });

    it('access() should handle undefined (returns unchanged)', () => {
      const value = access('test', undefined);
      expect(value).toBe('test');
      // undefined passes through - documented behavior
    });

    it('access() should handle null (returns null)', () => {
      const value = access('test', null);
      expect(value).toBe(null);
      // null accessor returns null - interesting edge case
    });

    it('accessByPath() should access nested properties', () => {
      // accessByPath is more specific - only path strings

      type Product = {
        details: {
          pricing: {
            amount: number;
          };
        };
      };

      const product: Product = {
        details: {
          pricing: {
            amount: 99.99,
          },
        },
      };

      const amount = accessByPath(product, 'details.pricing.amount');
      expect(amount).toBe(99.99);
      // Works for deep nesting - cleaner than chaining
    });

    it('accessByPathTo() should constrain by return type', () => {
      // accessByPathTo is for when you want to ensure the path returns a specific type
      // Type parameter R specifies the expected return type

      type Data = {
        count: number;
        total: number;
        name: string;
      };

      const data: Data = {
        count: 5,
        total: 100,
        name: 'test',
      };

      // This should work - both paths return numbers
      const count: number = accessByPathTo(data, 'count');
      const total: number = accessByPathTo(data, 'total');

      expect(count).toBe(5);
      expect(total).toBe(100);

      // Note: TypeScript would prevent accessing 'name' with number type annotation
      // const invalid: number = accessByPathTo(data, 'name'); // Would be compile error
      // This is the value of accessByPathTo - type constraint at compile time
    });

    it('accessTo() should work like access but with type constraint', () => {
      // accessTo is like access but constrains the return type

      type User = {
        age: number;
        score: number;
      };

      const user: User = {
        age: 25,
        score: 95,
      };

      // Can use path or function, but must return the specified type
      const age: number = accessTo(user, 'age');
      const doubled: number = accessTo(user, (u) => u.score * 2);

      expect(age).toBe(25);
      expect(doubled).toBe(190);
      // Combines flexibility of access with type safety of accessTo
    });
  });

  describe('Complex real-world scenarios', () => {
    // Now let me test some realistic, complex scenarios to see how it all fits together

    it('should handle nested arrays and objects', () => {
      // Complex data structure with nesting

      type Comment = {
        id: number;
        text: string;
        author: string;
      };

      type Post = {
        title: string;
        comments: Comment[];
      };

      const post: Post = {
        title: 'My Post',
        comments: [
          { id: 1, text: 'Great!', author: 'Alice' },
          { id: 2, text: 'Thanks!', author: 'Bob' },
        ],
      };

      const { container } = render(
        <ContentProvider value={post}>
          <h1>
            <FieldContent field="title" />
          </h1>
          <div>
            <FieldContent field="comments">
              <ArrayContent getKey="id" join={<br />}>
                <FieldContent field="author" />: <FieldContent field="text" />
              </ArrayContent>
            </FieldContent>
          </div>
        </ContentProvider>
      );

      expect(container.textContent).toContain('My Post');
      expect(container.textContent).toContain('Alice: Great!');
      expect(container.textContent).toContain('Bob: Thanks!');
      // Beautiful! Nesting is clean and logical. Each component creates its own context.
    });

    it('should handle optional nested fields gracefully', () => {
      // Real scenario: API response with optional fields

      type Address = {
        city: string;
        country?: string;
      };

      type User = {
        name: string;
        address?: Address;
      };

      const user1: User = {
        name: 'Alice',
        address: {
          city: 'NYC',
          country: 'USA',
        },
      };

      const user2: User = {
        name: 'Bob',
        address: {
          city: 'London',
          // no country
        },
      };

      const user3: User = {
        name: 'Charlie',
        // no address
      };

      const UserDisplay = ({ user }: { user: User }) => (
        <ContentProvider value={user}>
          <div>
            <FieldContent field="name" />
            <FieldContent field="address">
              <NullableContent nullContent=" - No address">
                {' - '}
                <FieldContent field="city" />,{' '}
                <FieldContent field="country">
                  <NullableContent nullContent="Unknown">
                    <DefaultContent />
                  </NullableContent>
                </FieldContent>
              </NullableContent>
            </FieldContent>
          </div>
        </ContentProvider>
      );

      const { container: c1 } = render(<UserDisplay user={user1} />);
      expect(c1.textContent).toBe('Alice - NYC, USA');

      const { container: c2 } = render(<UserDisplay user={user2} />);
      expect(c2.textContent).toBe('Bob - London, Unknown');

      const { container: c3 } = render(<UserDisplay user={user3} />);
      expect(c3.textContent).toBe('Charlie - No address');

      // Wow! NullableContent handles all the edge cases elegantly.
      // This pattern is really powerful for real-world data.
    });

    it('should create reusable renderer components', () => {
      // One of the key features mentioned: reusable components
      // Let me create a generic formatter that works with any data

      const CurrencyDisplay = () => {
        const amount = useContent<number>();
        return <span>${amount.toFixed(2)}</span>;
      };

      type Product = {
        name: string;
        price: number;
      };

      const product: Product = {
        name: 'Widget',
        price: 99.99,
      };

      const { container } = render(
        <ContentProvider value={product}>
          <FieldContent field="name" />: <FieldContent field="price">
            <CurrencyDisplay />
          </FieldContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('Widget: $99.99');

      // This is powerful! CurrencyDisplay is reusable anywhere there's a number in context.
      // It doesn't need to know about Product or price - just formats the current context value.
    });

    it('should compose multiple transformations', () => {
      // Chaining transformations through nested contexts

      type Data = {
        items: Array<{
          id: number;
          value: number;
        }>;
      };

      const data: Data = {
        items: [
          { id: 1, value: 10 },
          { id: 2, value: 20 },
          { id: 3, value: 30 },
        ],
      };

      const DoubleValue = () => {
        const value = useContent<number>();
        return <ContentProvider value={value * 2}>
          <DefaultContent />
        </ContentProvider>;
      };

      const { container } = render(
        <ContentProvider value={data}>
          <FieldContent field="items">
            <ArrayContent getKey="id" join=", ">
              <FieldContent field="value">
                <DoubleValue />
              </FieldContent>
            </ArrayContent>
          </FieldContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('20, 40, 60');
      // Composability! Each component transforms and passes down.
      // This is the "micro-context" power - small, composable transformations.
    });

    it('should work with ContentValue for complex paths in lists', () => {
      // Using ContentValue with path strings to avoid deep nesting

      type Order = {
        id: string;
        customer: {
          profile: {
            name: string;
          };
        };
        total: number;
      };

      const orders: Order[] = [
        {
          id: 'A',
          customer: { profile: { name: 'Alice' } },
          total: 100,
        },
        {
          id: 'B',
          customer: { profile: { name: 'Bob' } },
          total: 200,
        },
      ];

      const { container } = render(
        <ContentProvider value={orders}>
          <ArrayContent getKey="id" join=" | ">
            <ContentValue accessor="customer.profile.name">
              <DefaultContent />
            </ContentValue>
            :{' '}
            <FieldContent field="total">
              <DefaultContent />
            </FieldContent>
          </ArrayContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('Alice: 100 | Bob: 200');
      // ContentValue with path strings makes deep access so much cleaner!
      // Would have needed 3 nested FieldContent otherwise.
    });
  });

  describe('Edge cases and gotchas', () => {
    // Let me test some potential pitfalls I might encounter

    it('should throw error when useContent called outside provider', () => {
      // What happens if I forget ContentProvider?

      const BadComponent = () => {
        const value = useContent<string>();
        return <div>{value}</div>;
      };

      expect(() => render(<BadComponent />)).toThrow();
      // Good! Clear error when context is missing. Prevents silent bugs.
    });

    it('should throw error when useIndex called outside ArrayContent/ObjectContent', () => {
      // Same for useIndex

      const BadComponent = () => {
        const index = useIndex();
        return <div>{index}</div>;
      };

      expect(() => render(<BadComponent />)).toThrow();
      // Expected - index only exists during iteration
    });

    it('should throw error when useKey called outside ObjectContent', () => {
      // And useKey

      const BadComponent = () => {
        const key = useKey();
        return <div>{String(key)}</div>;
      };

      expect(() => render(<BadComponent />)).toThrow();
      // Consistent behavior - all context hooks throw when context missing
    });

    it('should NOT default children for ArrayContent with objects', () => {
      // The docs warn about this - DefaultContent can't render objects
      // ArrayContent defaults to DefaultContent, which would fail

      type Item = { id: number; name: string };
      const items: Item[] = [{ id: 1, name: 'Test' }];

      // This would cause "Objects are not valid as a React child" error in real app
      // In test, just verify we need explicit children for objects
      expect(() =>
        render(
          <ContentProvider value={items}>
            <ArrayContent />
          </ContentProvider>
        )
      ).toThrow();
      // Yep, throws as expected. Must provide children for object arrays.
    });

    it('should handle empty object iteration', () => {
      // What happens with empty objects?

      const emptyObj = {};

      const { container } = render(
        <ContentProvider value={emptyObj}>
          <ObjectContent>
            <KeyContent />
          </ObjectContent>
        </ContentProvider>
      );

      expect(container.textContent).toBe('');
      // Renders nothing - makes sense for empty object
    });
  });

  describe('Type safety observations', () => {
    // As a user, I notice the type safety features mentioned in docs

    it('should have type-safe path accessors (compile-time only)', () => {
      // The docs emphasize TypeScript autocomplete and compile-time errors
      // Can't really test this in runtime, but documenting the expected behavior

      type User = {
        profile: {
          email: string;
        };
      };

      const user: User = {
        profile: {
          email: 'test@example.com',
        },
      };

      // This should have autocomplete in IDE: "profile" and "profile.email"
      const email = accessByPath(user, 'profile.email');
      expect(email).toBe('test@example.com');

      // This would be a compile error (tested at build time, not runtime):
      // const invalid = accessByPath(user, 'profile.age'); // ✗ TypeScript error
      // const typo = accessByPath(user, 'profil.email'); // ✗ TypeScript error

      // As a user, I appreciate this type safety! Catches bugs early.
    });

    it('should infer return types from paths', () => {
      // Return types should be inferred from the path

      type Data = {
        count: number;
        name: string;
      };

      const data: Data = {
        count: 42,
        name: 'test',
      };

      const count = accessByPath(data, 'count');
      const name = accessByPath(data, 'name');

      // TypeScript knows count is number and name is string
      expect(typeof count).toBe('number');
      expect(typeof name).toBe('string');

      // Can't test the actual TypeScript types here, but the values prove inference works
    });
  });

  describe('Overall impressions as a new user', () => {
    it('demonstrates the micro-context pattern effectively', () => {
      // After exploring everything, I understand the "micro-context" concept
      // It's about:
      // 1. Small, scoped contexts (not app-wide)
      // 2. Composable transformations (each component transforms and passes down)
      // 3. Reusable renderers (components work with context, not props)
      // 4. No prop drilling (data flows through context)

      // Here's a complex example showing all these principles:

      const Formatter = ({ prefix }: { prefix: string }) => {
        const value = useContent<any>();
        return <span>{prefix}{value}</span>;
      };

      type Invoice = {
        id: string;
        items: Array<{
          name: string;
          price: number;
        }>;
      };

      const invoice: Invoice = {
        id: 'INV-001',
        items: [
          { name: 'Item A', price: 10 },
          { name: 'Item B', price: 20 },
        ],
      };

      const { container } = render(
        <ContentProvider value={invoice}>
          <div>
            Invoice: <FieldContent field="id" />
          </div>
          <div>
            Items:
            <FieldContent field="items">
              {/* Need inline type annotation here too - a bit ugly but necessary */}
              {/* Would be cleaner if I could reference Invoice['items'][number] somehow? */}
              <ArrayContent getKey={(item: { name: string; price: number }) => item.name} join=", ">
                <FieldContent field="name" />
                {' ($'}
                <FieldContent field="price">
                  <Formatter prefix="" />
                </FieldContent>
                {')'}
              </ArrayContent>
            </FieldContent>
          </div>
        </ContentProvider>
      );

      expect(container.textContent).toContain('INV-001');
      expect(container.textContent).toContain('Item A ($10)');
      expect(container.textContent).toContain('Item B ($20)');

      // This pattern is really elegant! Each component:
      // - Creates its own scoped context
      // - Transforms data declaratively
      // - Can be reused anywhere
      // - Doesn't need to know about parent structure
    });
  });

  // FINAL THOUGHTS as a new user:
  //
  // LIKES:
  // ✓ Very clean, declarative API
  // ✓ The micro-context pattern makes complex data rendering simple
  // ✓ Excellent composability - components just work together
  // ✓ TypeScript support seems robust (path autocomplete, type inference)
  // ✓ Great for avoiding prop drilling
  // ✓ Reusable renderers are powerful - write once, use anywhere
  // ✓ NullableContent, EmptyContent patterns are elegant for real-world data
  // ✓ ContentValue with path strings avoids deep nesting
  //
  // OBSERVATIONS:
  // - Need to remember DefaultContent only works with primitives
  // - Must provide explicit children for ArrayContent with object arrays
  // - The nesting can get deep, but that's the nature of the pattern
  // - ContentValue with paths is better for deep access than nested FieldContent
  //
  // QUESTIONS/WISHES:
  // - The docs are good, but some examples could show more complex real-world scenarios
  // - Would be nice to have more examples of custom isEmpty functions
  // - The difference between ContentValue and FieldContent could be clearer up front
  //   (I figured out ContentValue is more powerful, but took some exploration)
  // - AccessorContent vs ContentValue naming - docs mention it's an alias, good to know
  //
  // OVERALL: This is a really well-designed library! The micro-context pattern
  // is a fresh take on component composition. Once you understand the core concept
  // of "each component creates its own scoped context", everything else makes sense.
  // Would definitely use this for complex data rendering scenarios.
});

// review: if in UserDisplay you use `<ContentValue value={user} accessor={undefined}>` instead of ContentProvider and make user prop optional,
// it will accept both prop and context value. Nice flexibility!
