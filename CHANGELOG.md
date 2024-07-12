# Changelog

All notable changes to this project will be documented in this file.

<!-- new release -->

### [0.4.0](https://github.com/ctablex/core/compare/v0.3.0...v0.4.0) (2022-10-16)

### Highlights

Now components can be customized with xEl prop instead of xProps. It helps for a better type check.

```tsx
return <Row TrProps={{ className: 'zebra' }} />;
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
const MyTr = withDefaultChildren('tr');
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
