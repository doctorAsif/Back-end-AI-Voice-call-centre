/* eslint-env node */
/* global describe it expect vi */
import { render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import VoiceApp from '../VoiceApp';
import { vi } from 'vitest';

// Mock MediaRecorder
global.MediaRecorder = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: vi.fn().mockReturnValue([]),
    }),
  },
  configurable: true,
});

describe('VoiceApp component', () => {
  it('displays user and AI messages', async () => {
    let mockSocketInstance;
    const webSocketSpy = vi.spyOn(global, 'WebSocket').mockImplementation((url) => {
        mockSocketInstance = {
            url,
            send: vi.fn(),
            close: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            onopen: () => {},
            onmessage: () => {},
            onclose: () => {},
            onerror: () => {},
            readyState: 0, // CONNECTING
        };
        // Trigger onopen immediately to simulate successful connection
        setTimeout(() => {
            mockSocketInstance.readyState = 1; // OPEN
            mockSocketInstance.onopen();
        }, 0);
        return mockSocketInstance;
    });

    render(<VoiceApp />);

    const startButton = screen.getByRole('button', { name: /Start Recording/i });
    fireEvent.click(startButton);

    await screen.findByRole('button', { name: /Stop Recording/i });

    act(() => {
      mockSocketInstance.onmessage({ data: JSON.stringify({ type: 'user_text', content: 'Hello, AI!' }) });
    });

    expect(await screen.findByText('Hello, AI!')).toBeInTheDocument();

    act(() => {
      mockSocketInstance.onmessage({ data: JSON.stringify({ type: 'text', content: 'Hello, User!' }) });
    });

    expect(await screen.findByText('Hello, User!')).toBeInTheDocument();

    webSocketSpy.mockRestore();
  });
});
