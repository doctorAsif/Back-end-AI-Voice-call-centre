
import React, { useState, useEffect } from 'react';
import { SIMULATION_STEPS } from './constants';
import SystemDiagram from './components/SystemDiagram';
import Modal from './components/Modal';
import type { ComponentData } from './types';
import VoiceApp from './VoiceApp'; // Import the VoiceApp component

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [showVoiceApp, setShowVoiceApp] = useState(false); // State to toggle the view
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startSimulation = () => {
    setActiveStep(0);
    setIsSimulating(true);
  };

  useEffect(() => {
    if (isSimulating && activeStep !== null && activeStep < SIMULATION_STEPS.length) {
      const currentStep = SIMULATION_STEPS[activeStep];
      timerRef.current = setTimeout(() => {
        setActiveStep(prev => (prev !== null ? prev + 1 : 0));
      }, currentStep.duration);
    } else if (activeStep !== null && activeStep >= SIMULATION_STEPS.length) {
      setIsSimulating(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isSimulating, activeStep]);

  if (showVoiceApp) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-8 flex flex-col items-center">
        <button
          onClick={() => setShowVoiceApp(false)}
          className="mb-4 px-4 py-2 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-700"
        >
          Back to Simulation
        </button>
        <VoiceApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center mb-8 w-full max-w-5xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-cyan-400 mb-2">
          AI Voice Agent Architecture
        </h1>
        <p className="text-lg text-slate-400">
          An interactive visualization of a real-time AI voice agent pipeline.
        </p>
      </header>

      <main className="w-full flex-grow flex flex-col items-center">
        <SystemDiagram activeStep={activeStep} onComponentClick={setSelectedComponent} />
        <div className="mt-8 w-full max-w-3xl p-4 bg-slate-800 rounded-lg shadow-lg">
          <div className="font-mono text-sm text-slate-300 h-24 overflow-y-auto">
            {isSimulating && activeStep !== null ? (
              <p>{SIMULATION_STEPS[activeStep]?.description || 'Simulation starting...'}</p>
            ) : (
              <p>{activeStep !== null ? 'Simulation complete.' : 'Click "Simulate Call Flow" to begin.'}</p>
            )}
          </div>
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-700 disabled:bg-slate-600"
          >
            {isSimulating && activeStep !== null ? `Simulating... (Step ${activeStep + 1}/${SIMULATION_STEPS.length})` : 'Simulate Call Flow'}
          </button>
          <button
            onClick={() => setShowVoiceApp(true)}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700"
          >
            Try the Live Voice App
          </button>
        </div>
      </main>
      {selectedComponent && (
        <Modal component={selectedComponent} onClose={() => setSelectedComponent(null)} />
      )}
    </div>
  );
};

export default App;
