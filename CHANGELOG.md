# Changelog

All notable changes to this project will be documented in this file.

<!-- new release -->

## Unreleased

## [0.6.5](https://github.com/ctablex/core/compare/0.6.4...0.6.5) (2025-05-27)

- add react 19 as peer dependency

## [0.6.4](https://github.com/ctablex/core/compare/0.6.3...0.6.4) (2025-05-27)

### Fixes

- remove embedded react in final bundle

## [0.6.3](https://github.com/ctablex/core/compare/0.6.2...0.6.3) (2025-02-26)

### Changed

- add support for `undefined` accessor. the `undefined` accessor will return value unchanged. 

## [0.6.2](https://github.com/ctablex/core/compare/0.6.1...0.6.2) (2025-02-16)

### Table

- reexport `DefaultContent` and `NullableContent`

## [0.6.1](https://github.com/ctablex/core/compare/0.6.0...0.6.1) (2025-02-16)

### Core

- Add optional `value` prop to `AccessorContent`, `ArrayContent`, `ObjectContent`

## [0.6.0](https://github.com/ctablex/core/compare/0.5.1...0.6.0) (2025-02-16)

### Breaking Changes

**Package Restructure**

- Rewrote `@ctablex/core` and moved core table concepts to `@ctablex/table`.

**Context Changes**

- All data now flows through `ContentContext` (replaces `DataContext`, `RowContext`, and other removed contexts).
- The `TableComponentsProvider` is replaced with `TableElementsProvider`

```tsx
const elements: TableElements = {
  table: <table data-testid="ctx-table" />,
  thead: <thead data-testid="ctx-thead" />,
  tbody: <tbody data-testid="ctx-tbody" />,
  tfoot: <tfoot data-testid="ctx-tfoot" />,
  tr: <tr data-testid="ctx-tr" />,
  th: <th data-testid="ctx-th" />,
  td: <td data-testid="ctx-td" />,
};

<TableElementsProvider value={elements}>
```

**Prop Cleanup**

- Removed all deprecated `*Props` props (`tdProps`, `thProps`, etc.).
- Consolidated `*El` props into the `el` prop (e.g., `tdEl` → `el`).  
   **Exception:** `<Column />` retains `thEl` for header customization:
  ```tsx
  <Column el={<td />} thEl={<th />} />
  ```
  **Element Prop Behavior**
- `el` now automatically injects `children`. For empty content, pass `null` explicitly:
  ```tsx
  <Column el={<td>{null}</td>} /> // Explicit empty content
  ```
  _(Ariakit-style [composition][ariakit composition])_

**Accessor Default Change**

- Default `accessor` is no longer `null`. To replicate old behavior:
  ```tsx
  // Old:
  <Column /> // (accessor=null)
  // New:
  <Column accessor={null} />
  ```
  Omitting `accessor` now passes content down without change.

### Improvements

**Type-Safe Accessors**

- Accessor paths are now validated with TypeScript. Typos trigger immediate feedback:

  ```tsx
  type Data = { name: { first: string; last: string } };

  <Column<Data> accessor="name.first" />  // ✅ Valid
  <Column<Data> accessor="name.las" />   // ❌ Error: "Did you mean 'name.last'?"
  ```

[ariakit composition]: https://ariakit.org/guide/composition

## [0.5.1](https://github.com/ctablex/core/compare/0.5.0...0.5.1) (2024-07-12)

- add repository to package.json ([9350975](https://github.com/ctablex/core/commit/93509758734028559d668f42f3c55f8f57d8c93c))

## [0.5.0](https://github.com/ctablex/core/compare/v0.4.1...v0.5.0) (2024-07-12)

### ⚠ BREAKING CHANGES

- Change dist files and remove umd build
- Use vite for build ([#2](https://github.com/ctablex/core/pull/2)) ([75c0cfb](https://github.com/ctablex/core/commit/75c0cfb8cadc9f46cab7f448c31b46470f95d92d))

### [0.4.0](https://github.com/ctablex/core/compare/v0.3.0...v0.4.0) (2022-10-16)

### Highlights

Now components can be customized with xEl prop instead of xProps. It helps for a better type check.

```tsx
return <Row TrProps={{ className: "zebra" }} />;
// vs
return (
  <Row
    trEl={
      <tr className="zebra">
        <Children />
      </tr>
    }
  />
);
// or
const MyTr = withDefaultChildren("tr");
return <Row trEl={<MyTr className="zebra" />} />;
```

### Features

- add and use table elements context ([0441555](https://github.com/ctablex/core/commit/0441555b21e0412a631a072eb0535363232ec5ff))
- add children context ([f39f6ca](https://github.com/ctablex/core/commit/f39f6ca10229615d06112cd051de1e9046ef2fdf))
- **row:** add and use CurrentRowDataProvider component ([5ad330b](https://github.com/ctablex/core/commit/5ad330b1d96155cea227a0cd831e9e21aee1c2c9))

### Examples

- **multipart:** add multipart example ([20ae64c](https://github.com/ctablex/core/commit/20ae64c9f17f9b853392873d5205e740f3769caa))
- rename example directory names ([53f1a22](https://github.com/ctablex/core/commit/53f1a22b6b8fb1486313e6c114ab58554165d797))

## [0.3.0](https://github.com/ctablex/core/compare/v0.2.1...v0.3.0) (2020-12-20)

### Features

- add default children to table/table-body/table-header/row/rows components ([7091f5f](https://github.com/ctablex/core/commit/7091f5fb389e21e635752167556a2a6127fd1d97))
- **columns:** add part props in columns usage ([1de25ca](https://github.com/ctablex/core/commit/1de25ca6e52771caa22ee735164fcff534233970))
- accept and pass props to underlying components ([d672f4d](https://github.com/ctablex/core/commit/d672f4d914f5a1b7ce5c0480e782dc33550782fe))

### Examples

- **complex-content:** add complex content example ([7553c57](https://github.com/ctablex/core/commit/7553c57f57f29e29e146c4795ff9f93fc414dd37))

### Documentations

- update readme and use new api ([494dab0](https://github.com/ctablex/core/commit/494dab029130c27be2cbcc56944ad770479327a1))

### [0.2.1](https://github.com/ctablex/core/compare/v0.2.0...v0.2.1) (2020-07-19)

### Features

- **columns:** support multi part tables ([be0152a](https://github.com/ctablex/core/commit/be0152aa65816b70887751a1421cb9c8464dbc58))

### Bug Fixes

- **content-value:** support missing value ([66ee464](https://github.com/ctablex/core/commit/66ee464917de6f2d8a4ab3e1b365c5ede46ff967))

### Examples

- **content:** add custom content example ([ff8cc88](https://github.com/ctablex/core/commit/ff8cc88a8f27fc3232e0513f118b72adba83ca66))
- **material-ui:** add material ui example ([7bfe86b](https://github.com/ctablex/core/commit/7bfe86bc8902de2c823289f103fb5d156901f93d))

## [0.2.0](https://github.com/ctablex/core/compare/v0.1.0...v0.2.0) (2020-07-14)

### ⚠ BREAKING CHANGES

- rename context types and providers

### Examples

- **basic:** add basic example ([ecbf8cb](https://github.com/ctablex/core/commit/ecbf8cb2c52a5be5785e7c1dcca2547c8242df85))

### Documentations

- **basic-example:** improve readme ([fa29cb8](https://github.com/ctablex/core/commit/fa29cb84c654f3d4b6fa81796d407f17d367ccf1))

* rename context types and providers ([a28ddc9](https://github.com/ctablex/core/commit/a28ddc9d1ab0c51d67bbf27c283d19f205f32fcf))

## [0.1.0](https://github.com/ctablex/core/compare/v0.0.1...v0.1.0) (2020-07-04)

### Features

- add table components ([f4d0d9a](https://github.com/ctablex/core/commit/f4d0d9ad43581f77ddebbec9b863f2c4557d114b))

### Documentations

- add the example section to the readme file ([cc62e78](https://github.com/ctablex/core/commit/cc62e7881cce56f2d7fe424ab5e01d13147d525b))

### 0.0.1 (2020-06-24)

### Features

- init project ([25f72c9](https://github.com/ctablex/core/commit/25f72c94c5852224d10de8b3c1373284eeece743))
