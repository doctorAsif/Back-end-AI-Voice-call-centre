/* eslint-env node */
/* global describe it expect vi beforeEach */
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import VoiceApp from '../VoiceApp';

// Mock MediaRecorder
const mockMediaRecorder = {
  start: vi.fn(),
  stop: vi.fn(),
  addEventListener: vi.fn(),
};
vi.stubGlobal('MediaRecorder', vi.fn().mockImplementation(() => mockMediaRecorder));

// Mock getUserMedia
vi.stubGlobal('navigator', {
  mediaDevices: {
    getUserMedia: vi.fn().mockResolvedValue({}),
  },
});

// Mock WebSocket
const mockSocket = {
  send: vi.fn(),
  close: vi.fn(),
  onopen: () => {},
  onmessage: (event) => {},
};
vi.stubGlobal('WebSocket', vi.fn().mockImplementation(() => mockSocket));


describe('VoiceApp', () => {
  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays user and AI messages received from WebSocket', async () => {
    render(<VoiceApp />);

    // Click "Start Recording" to set up the WebSocket
    const startButton = screen.getByRole('button', { name: /Start Recording/i });
    fireEvent.click(startButton);

    // Wait for promise resolution inside handleToggleRecording
    await act(async () => {});

    // Trigger the onopen event to simulate connection
    act(() => {
        mockSocket.onopen();
    });

    // Simulate receiving a user message from the WebSocket
    act(() => {
      mockSocket.onmessage({
        data: JSON.stringify({ type: 'user_text', content: 'Hello AI!' }),
      });
    });

    // Check if the user's message is displayed correctly
    const userMessageContainer = screen.getByText('You:').parentElement;
    expect(userMessageContainer).toHaveTextContent('You: Hello AI!');

    // Simulate receiving an AI message from the WebSocket
    act(() => {
      mockSocket.onmessage({
        data: JSON.stringify({ type: 'text', content: 'Hello User!' }),
      });
    });

    // Check if the AI's message is displayed correctly
    const aiMessageContainer = screen.getByText('AI:').parentElement;
    expect(aiMessageContainer).toHaveTextContent('AI: Hello User!');
  });

  it('sends a WhatsApp message with the conversation history', async () => {
    // Set up fetch mock
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'success' }),
      })
    );

    render(<VoiceApp />);

    // --- Simulate a conversation first ---
    const startButton = screen.getByRole('button', { name: /Start Recording/i });
    fireEvent.click(startButton);
    await act(async () => {}); // Wait for promises
    act(() => {
        mockSocket.onopen();
    });
    act(() => {
      mockSocket.onmessage({ data: JSON.stringify({ type: 'user_text', content: 'Can you help me?' }) });
    });
    act(() => {
      mockSocket.onmessage({ data: JSON.stringify({ type: 'text', content: 'Yes, how can I help?' }) });
    });
    // --- End conversation simulation ---


    // Now, send to WhatsApp
    const phoneNumberInput = screen.getByPlaceholderText('Enter phone number');
    const sendButton = screen.getByText('Send to WhatsApp');

    fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
    fireEvent.click(sendButton);

    // Assert fetch was called with the correct conversation body
    expect(fetch).toHaveBeenCalledWith('/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '1234567890',
        body: 'User: Can you help me?\nAI: Yes, how can I help?',
      }),
    });
  });
});
