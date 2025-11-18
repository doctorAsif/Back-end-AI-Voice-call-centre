/* eslint-env node */
// Vitest globals supplied via tsconfig types; silence eslint no-undef
/* global describe it expect vi */
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentCard from '../components/ComponentCard';
import type { ComponentData } from '../types';
import React from 'react';

const sample: ComponentData = {
  id: 'sample',
  title: 'Sample Component',
  description: 'A sample description',
  examples: 'ExampleOne, ExampleTwo',
  icon: <span data-testid="icon">*</span>,
  gridClass: 'col-span-2',
  details: { pmTask: 'Do something', challenges: ['Challenge A'] }
};

describe('ComponentCard', () => {
  it('renders title & description', () => {
    render(<ComponentCard component={sample} isActive={false} onComponentClick={() => {}} />);
    expect(screen.getByText('Sample Component')).toBeInTheDocument();
    expect(screen.getByText('A sample description')).toBeInTheDocument();
  });

  it('invokes callback on click', () => {
    const handler = vi.fn();
    render(<ComponentCard component={sample} isActive={false} onComponentClick={handler} />);
    fireEvent.click(screen.getByText('Sample Component'));
    expect(handler).toHaveBeenCalledWith(sample);
  });
});
