import util from 'node:util';

import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const { error: originalError } = console;

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    originalError(...args);
    // @ts-ignore
    const error = util.format.apply(this, args);
    throw new Error(error);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});
