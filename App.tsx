
import React from 'react';
import VoiceApp from './VoiceApp';
import logo from './src/logo.jpeg';

const App: React.FC = () => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center mb-8 w-full max-w-5xl relative">
        <img src={logo} alt="HR Agency Ltd" className="mx-auto mb-4" style={{ height: '100px' }} />
        <h1 className="text-3xl sm:text-5xl font-bold text-teal-600 mb-2">
          AI Voice Agent
        </h1>
        <button
          onClick={handleShare}
          className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600"
        >
          Share
        </button>
      </header>

      <main className="w-full flex-grow flex flex-col items-center">
        <VoiceApp />
      </main>
    </div>
  );
};

export default App;
