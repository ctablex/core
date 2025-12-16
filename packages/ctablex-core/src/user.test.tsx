import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {} from './index'

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

describe('user test - exploring @ctablex/core as a new user', () => {});
