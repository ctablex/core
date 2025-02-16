---
"@ctablex/table": minor
"@ctablex/core": minor
---

rewrite `@ctablex/core`, move table concepts to `@ctablex/table`.

## Breaking

- Now all data will pass around via `ContentContext`
- The `DataContext`, `RowContext`, and many other contexts are removed.
- All deprecated `tdProps`, `thProps`, and other `*Props` props are removed.
- `tdEl`, `tableEl`, and other `*El` are changed to `el`. only `thEl` in `<Column />` component is exception

```tsx
<Column el={<td />} thEl={<th />} />
```

- The `el` props automatically add the `children` prop. It is similar to the [ariakit composition]. If you need empty content, you should pass null explicitly.

```tsx
<Column el={<td>{null}</td>} />
```

- default accessor is not `null` anymore.

```tsx
// old:
<Column />

// new
<Column accessor={null} /> // content is null
```

by default, the content will be passed down if the accessor is not provided.

## Improvements

- String accessors can be validated with typescript.

```tsx
type D = {
  name: {first: string, last: string}
}

<Column<D> accessor="name.first" />
<Column<D> accessor="name.las" /> // TS2820: Type 'name.las' is not assignable to type Accessor<D> | undefined. Did you mean 'name.last'?
```

[ariakit composition]: https://ariakit.org/guide/composition
