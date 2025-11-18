
import React from 'react';

export interface ComponentData {
  id: string;
  title: string;
  description: string;
  examples: string;
  icon: React.ReactNode;
  gridClass: string;
  details: {
    pmTask: string;
    challenges: string[];
  };
}

export interface SimulationStep {
  activeComponents: string[];
  activeConnectors: string[];
  description: string;
  startTime: number;
  duration: number;
}
