
import React, { useState, useRef } from 'react';

const VoiceApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      if (socket) {
        socket.close();
      }
      setIsRecording(false);
    } else {
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const newMediaRecorder = new MediaRecorder(stream);
          const newSocket = new WebSocket('ws://localhost:8000/ws/audio');

          newSocket.onopen = () => {
            newMediaRecorder.addEventListener('dataavailable', event => {
              newSocket.send(event.data);
            });
            newMediaRecorder.start(1000); // Send data every 1 second
          };

          newSocket.onmessage = event => {
            const data = JSON.parse(event.data);
            if (data.type === 'user_text') {
              setUserMessage(data.content);
            } else if (data.type === 'text') {
              setAiMessage(data.content);
            }
          };

          setSocket(newSocket);
          setMediaRecorder(newMediaRecorder);
          setIsRecording(true);
        })
        .catch(error => console.error('Error accessing microphone:', error));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Voice AI</h2>
      <button
        onClick={handleToggleRecording}
        className={`px-4 py-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className="mt-4">
        <p><strong>You:</strong> {userMessage}</p>
        <p><strong>AI:</strong> {aiMessage}</p>
      </div>
    </div>
  );
};

export default VoiceApp;
