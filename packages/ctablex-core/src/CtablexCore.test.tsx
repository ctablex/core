import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CtablexCore } from './CtablexCore';

describe('CtablexCore', () => {
  it('renders correctly', () => {
    render(<CtablexCore />);
    expect(screen.getByText('ctablex-core')).toBeInTheDocument();
  });
});
