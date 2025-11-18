
import React, { useMemo } from 'react';
import { COMPONENTS_DATA, SIMULATION_STEPS } from '../constants';
import ComponentCard from './ComponentCard';
import type { ComponentData } from '../types';

interface SystemDiagramProps {
  activeStep: number | null;
  onComponentClick: (component: ComponentData) => void;
}

const Connector: React.FC<{
  id: string;
  gridClass: string;
  isActive: boolean;
}> = ({ id, gridClass, isActive }) => {
  const baseClasses = "absolute bg-slate-700 rounded-full transition-all duration-300";
  const activeClasses = isActive ? "!bg-cyan-400 shadow-[0_0_10px_2px_theme(colors.cyan.400)]" : "";

  return (
    <div id={id} className={`${gridClass} ${baseClasses} ${activeClasses}`}></div>
  );
};


const SystemDiagram: React.FC<SystemDiagramProps> = ({ activeStep, onComponentClick }) => {

  const activeComponents = useMemo(() => {
    return activeStep !== null ? SIMULATION_STEPS[activeStep].activeComponents : [];
  }, [activeStep]);

  const activeConnectors = useMemo(() => {
    return activeStep !== null ? SIMULATION_STEPS[activeStep].activeConnectors : [];
  }, [activeStep]);

  return (
    <div className="relative w-full aspect-[2/1] min-h-[600px] lg:min-h-0">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 gap-4">
          {COMPONENTS_DATA.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              isActive={activeComponents.includes(component.id)}
              onComponentClick={onComponentClick}
            />
          ))}
          
          {/* Connectors */}
          <Connector id="phone-stt" gridClass="col-start-2 row-start-2 h-full w-2 left-1/2 -translate-x-1/2" isActive={activeConnectors.includes('phone-stt')} />
          <Connector id="stt-conductor" gridClass="col-start-2 row-start-4 h-2 w-full top-1/2 -translate-y-1/2" isActive={activeConnectors.includes('stt-conductor')} />
          <Connector id="conductor-brain" gridClass="col-start-4 row-start-3 h-full w-2 left-1/2 -translate-x-1/2" isActive={activeConnectors.includes('conductor-brain') || activeConnectors.includes('brain-conductor')} />
          <Connector id="conductor-memory" gridClass="col-start-5 row-start-3 h-full w-2 left-1/2 -translate-x-1/2" isActive={activeConnectors.includes('conductor-memory') || activeConnectors.includes('memory-conductor')} />
          <Connector id="conductor-tts" gridClass="col-start-6 row-start-2 h-full w-2 left-1/2 -translate-x-1/2 rotate-45 origin-bottom-left" isActive={activeConnectors.includes('conductor-tts')} />
          <Connector id="tts-phone" gridClass="col-start-7 row-start-1 h-2 w-full top-1/2 -translate-y-1/2" isActive={activeConnectors.includes('tts-phone')} />
          <Connector id="conductor-human" gridClass="col-start-7 row-start-4 h-2 w-full top-1/2 -translate-y-1/2" isActive={activeConnectors.includes('conductor-human')} />

        </div>
    </div>
  );
};

export default SystemDiagram;
