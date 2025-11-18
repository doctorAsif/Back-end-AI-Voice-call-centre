/* eslint-env node */
/* global describe it expect vi */
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import App from '../App';

// Helper to fast-forward all timers
function advanceAll(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

// TODO: This test is no longer valid as the simulation flow has been removed from the App component.
describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText(/AI Voice Agent/i)).toBeInTheDocument();
  });
});
// describe('App simulation flow', () => {
//   it('runs through simulation steps and completes', () => {
//     vi.useFakeTimers();
//     render(<App />);

//     // Initial state text
//     expect(screen.getByText(/Click "Simulate Call Flow"/i)).toBeInTheDocument();

//     const button = screen.getByRole('button', { name: /Simulate Call Flow/i });
//     fireEvent.click(button);

//     // After start first description should show quickly
//     advanceAll(10);
//     expect(screen.getByText(/Customer calls the phone number/i)).toBeInTheDocument();

//   // Advance into the "Brain needs info" step (starts at 4000ms)
//   advanceAll(4000);
//   expect(screen.getByText(/Brain needs info/i)).toBeInTheDocument();

//   // Finish all remaining timers (advance beyond total duration)
//   advanceAll(8000);
//     expect(screen.getByText(/Simulation complete/i)).toBeInTheDocument();

//     vi.useRealTimers();
//   });
// });
