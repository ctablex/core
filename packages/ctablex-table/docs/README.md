# @ctablex/table Documentation

Documentation for **@ctablex/table** - a React table library built on the micro-context pattern.

## Documentation Files

- **[OVERVIEW.md](./OVERVIEW.md)** - Introduction, installation, quick start, and common patterns
- **[COMPONENTS.md](./COMPONENTS.md)** - Complete API reference for all components
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Customizing elements, styling, and content components
- **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)** - Internal architecture and rendering phases

## Where to Start

**New users:** Start with [OVERVIEW.md](./OVERVIEW.md)

**API reference:** See [COMPONENTS.md](./COMPONENTS.md)

**Styling/theming:** See [CUSTOMIZATION.md](./CUSTOMIZATION.md)

**Understanding internals:** See [HOW-IT-WORKS.md](./HOW-IT-WORKS.md)

## Document Descriptions

### OVERVIEW.md

Introduction to the library with installation instructions, quick start examples, and high-level explanation of how data flows through tables. Covers basic usage, custom content rendering, complex cells, and multi-part columns. **Start here if you're new.**

### COMPONENTS.md

Comprehensive API reference for all exported components including `DataTable`, `Table`, `TableHeader`, `TableBody`, `TableFooter`, `Columns`, `Column`, `Rows`, `Row`, `Cell`, and `HeaderCell`. Each component's props, types, default behaviors, and usage examples are documented. **Use this as your API reference.**

### CUSTOMIZATION.md

Guide to customizing table rendering at every level: using the `el` prop on individual components, using `TableElementsProvider` for global element customization, creating custom content components, and integrating with UI libraries (Material-UI, Tailwind, etc.). **Read this when you need to style or customize your tables.**

### HOW-IT-WORKS.md

In-depth explanation of the internal architecture including the three-context system (Content, Part, Columns), two-phase rendering (column extraction and rendering), part-based rendering, data flow, component lifecycle, and performance considerations. **Read this for deep understanding of the internals.**

## Related Documentation

- **[@ctablex/core](../../ctablex-core/docs/)** - Core library and micro-context pattern
- **[Examples](../../../examples/)** - Working examples
