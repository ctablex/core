import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CtablexTable } from './CtablexTable';

describe('CtablexTable', () => {
  it('renders correctly', () => {
    render(<CtablexTable />);
    expect(screen.getByText('ctablex-table')).toBeInTheDocument();
  });
});
