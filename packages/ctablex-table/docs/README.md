# @ctablex/table Documentation

Documentation for **@ctablex/table** - a React table library built on the micro-context pattern.

## Quick Navigation

### Getting Started

**New to @ctablex/table?** Start here:

- **[OVERVIEW.md](./OVERVIEW.md)** - Introduction, quick start, basic usage, and common patterns

### Reference Documentation

- **[COMPONENTS.md](./COMPONENTS.md)** - Complete API reference for all components with props, types, and examples
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Guide to customizing table rendering (elements, styling, content components)

### Advanced Topics

- **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)** - Deep dive into internal architecture, rendering phases, and data flow

### Core Concepts

To fully understand @ctablex/table, familiarize yourself with the micro-context pattern:

- **[@ctablex/core docs](../../ctablex-core/docs/)** - Core library documentation
- **[Micro-Context Pattern](../../ctablex-core/docs/MICRO-CONTEXT.md)** - The fundamental pattern behind the library

## Document Descriptions

### OVERVIEW.md

Introduction to the library with installation instructions, quick start examples, and high-level explanation of how data flows through tables. Covers basic usage, custom content rendering, complex cells, and multi-part columns. **Start here if you're new.**

### COMPONENTS.md

Comprehensive API reference for all exported components including `DataTable`, `Table`, `TableHeader`, `TableBody`, `TableFooter`, `Columns`, `Column`, `Rows`, `Row`, `Cell`, and `HeaderCell`. Each component's props, types, default behaviors, and usage examples are documented. **Use this as your API reference.**

### CUSTOMIZATION.md

Guide to customizing table rendering at every level: using the `el` prop on individual components, using `TableElementsProvider` for global element customization, creating custom content components, and integrating with UI libraries (Material-UI, Tailwind, etc.). **Read this when you need to style or customize your tables.**

### HOW-IT-WORKS.md

In-depth explanation of the internal architecture including the three-context system (Content, Part, Columns), two-phase rendering (column extraction and rendering), part-based rendering, data flow, component lifecycle, and performance considerations. **Read this for deep understanding of the internals.**

## Suggested Reading Paths

### For Quick Usage

1. [OVERVIEW.md](./OVERVIEW.md) - Learn basics
2. [COMPONENTS.md](./COMPONENTS.md) - Reference as needed

### For Styling/Theming

1. [OVERVIEW.md](./OVERVIEW.md) - Understand basics
2. [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Learn customization approaches

### For Deep Understanding

1. [OVERVIEW.md](./OVERVIEW.md) - Understand basics
2. [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) - Learn internals
3. [@ctablex/core - MICRO-CONTEXT.md](../../ctablex-core/docs/MICRO-CONTEXT.md) - Understand the pattern

### For Building Extensions

1. [OVERVIEW.md](./OVERVIEW.md) - Understand basics
2. [COMPONENTS.md](./COMPONENTS.md) - Know the API
3. [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) - Understand internals
4. [CUSTOMIZATION.md](./CUSTOMIZATION.md) - See customization patterns

## Common Tasks

### Creating a Basic Table

See: [OVERVIEW.md - Quick Start](./OVERVIEW.md#quick-start)

### Adding Custom Content Renderers

See: [OVERVIEW.md - Custom Content Rendering](./OVERVIEW.md#custom-content-rendering)

### Styling with CSS/UI Libraries

See: [CUSTOMIZATION.md - Styling Approaches](./CUSTOMIZATION.md#styling-approaches)

### Multi-Part Tables (Header/Body/Footer)

See: [OVERVIEW.md - Multi-Part Columns](./OVERVIEW.md#multi-part-columns)

### Understanding Data Flow

See: [HOW-IT-WORKS.md - Data Flow](./HOW-IT-WORKS.md#data-flow)

### Component Props Reference

See: [COMPONENTS.md](./COMPONENTS.md)

## External Resources

- **[@ctablex/core documentation](../../ctablex-core/docs/)** - Core library with content components
- **[GitHub Repository](https://github.com/ctablex/core)** - Source code and issues
- **[Examples](../../../examples/)** - Working examples with different use cases

## Need Help?

1. **Getting started?** → [OVERVIEW.md](./OVERVIEW.md)
2. **Looking for a specific component API?** → [COMPONENTS.md](./COMPONENTS.md)
3. **Need to customize styling?** → [CUSTOMIZATION.md](./CUSTOMIZATION.md)
4. **Want to understand how it works?** → [HOW-IT-WORKS.md](./HOW-IT-WORKS.md)
5. **Confused about micro-context?** → [@ctablex/core - MICRO-CONTEXT.md](../../ctablex-core/docs/MICRO-CONTEXT.md)
