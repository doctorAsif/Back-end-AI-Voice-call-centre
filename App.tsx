
import React from 'react';
import VoiceApp from './VoiceApp';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center mb-8 w-full max-w-5xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-cyan-400 mb-2">
          AI Voice Agent
        </h1>
      </header>

      <main className="w-full flex-grow flex flex-col items-center">
        <VoiceApp />
      </main>
    </div>
  );
};

export default App;
