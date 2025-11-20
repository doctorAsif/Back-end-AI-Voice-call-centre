/* eslint-env node */
/* global describe it expect vi */
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('App', () => {
  it('runs through simulation steps and completes', async () => {
    vi.useFakeTimers();
    render(<App />);

    // Initial state text
    expect(screen.getByText(/Click "Simulate Call Flow" to begin./i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Simulate Call Flow/i });
    fireEvent.click(button);

    // After start first description should show quickly
    await act(async () => {
        vi.advanceTimersByTime(10);
    });
    expect(await screen.findByText(/Customer calls the phone number/i)).toBeInTheDocument();

    // Advance into the "Brain needs info" step (starts at 4000ms)
    await act(async () => {
        vi.advanceTimersByTime(4000);
    });
    expect(await screen.findByText(/Brain needs info/i)).toBeInTheDocument();

    // Finish all remaining timers (advance beyond total duration)
    await act(async () => {
        vi.advanceTimersByTime(8000);
    });
    expect(await screen.findByText(/Simulation complete/i)).toBeInTheDocument();

    vi.useRealTimers();
  }, 30000);

  it('switches to the live voice app', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Try the Live Voice App/i });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /Back to Simulation/i })).toBeInTheDocument();
  });
});
