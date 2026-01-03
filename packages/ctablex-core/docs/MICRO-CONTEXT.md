# Micro-Context Pattern

## What is Micro-Context?

**Micro-context** is a pattern for passing data and state through localized React Context instead of props. Unlike traditional "macro-context" patterns (like theme providers or auth state that span entire applications), micro-context creates small, scoped context providers within component subtrees for fine-grained data flow.

This enables **declarative data transformation** with minimal manual prop passing—components describe what data they need, not how to pass it through every layer.

## Traditional React Way

In traditional React patterns, data flows through props manually. If we have array data, we would typically iterate and pass data down via props:

```tsx
<ul>
  {data.map((item) => (
    <li>
      <NumberFormatter value={item.price} />
    </li>
  ))}
</ul>
```

- **Prop drilling** - Every intermediate component must accept and pass props
- **Tight coupling** - Child components are explicitly bound to parent props
- **Limited composition** - Hard to create reusable renderers that work in different contexts

## The Micro-Context Way

Instead of passing data as props, wrap it in a context provider, no data passed via props or manual iteration:

```tsx
<ContentProvider value={data}>
  <ul>
    <ArrayContent>
      <li>
        <FieldContent field="price">
          <NumberContent />
        </FieldContent>
      </li>
    </ArrayContent>
  </ul>
</ContentProvider>
```

In this example:

- `ContentProvider` provides the entire data array via context
- `ArrayContent` reads the array from context and iterates, providing each item via context
- `FieldContent` extracts the specified field from the current item and provides it via context
- `NumberContent` reads the value from context and formats it and renders formatted output

You can think about ArrayContent like this:

```tsx
<ContentProvider value={data}>
  <ul>
    <ContentProvider value={data[0]}>
      <li>
        <FieldContent field="price">
          <NumberContent />
        </FieldContent>
      </li>
    </ContentProvider>
    <ContentProvider value={data[1]}>
      <li>
        <FieldContent field="price">
          <NumberContent />
        </FieldContent>
      </li>
    </ContentProvider>
    {/* ...and so on for each item */}
  </ul>
</ContentProvider>
```

Same for FieldContent:

```tsx
<ContentProvider value={data}>
  <ul>
    <ContentProvider value={data[0]}>
      <li>
        {/* ContentField Extracts "price" field, provides it via context */}
        <ContentProvider value={data[0].price}>
          <NumberContent />
        </ContentProvider>
      </li>
    </ContentProvider>
    {/* ...and so on for each item */}
  </ul>
</ContentProvider>
```

And finally, NumberContent just reads the value from context and formats it.

```tsx
function NumberContent() {
  const value = useContent<number>(); // gets value from nearest context
  return <>{formatNumber(value)}</>;
}
```

We can go one step further and fetch and provide data in a reusable component:

```tsx
<ProductDataProvider>
  <ul>
    <ArrayContent>
      <li>
        <FieldContent field="price">
          <NumberContent />
        </FieldContent>
      </li>
    </ArrayContent>
  </ul>
</ProductDataProvider>
```

`ProductDataProvider` fetches product data and provides it via context. It encapsulates data fetching logic, so the rest of the component tree just declares who data is displayed.

Notice that no data props are passed through `ProductDataProvider`, `ul`, `li`, or `NumberContent` and Component structure is completely constant and no changing props is here, only context changes. This enables powerful patterns for building flexible, composable components.
