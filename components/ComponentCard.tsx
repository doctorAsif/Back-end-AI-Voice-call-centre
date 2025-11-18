
import React from 'react';
import type { ComponentData } from '../types';

interface ComponentCardProps {
  component: ComponentData;
  isActive: boolean;
  onComponentClick: (component: ComponentData) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, isActive, onComponentClick }) => {
  const { icon, title, description, examples, gridClass } = component;

  const cardClasses = `
    ${gridClass}
    bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg
    flex flex-col items-center text-center
    border border-slate-700
    transition-all duration-300
    cursor-pointer hover:border-cyan-400/70
    ${isActive ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-cyan-500/20' : ''}
  `;

  return (
    <div
      className={cardClasses}
      onClick={() => onComponentClick(component)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onComponentClick(component); } }}
    >
      {icon}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm mb-4 flex-grow">{description}</p>
      <div className="w-full pt-3 border-t border-slate-700">
        <p className="text-xs text-slate-400 font-mono tracking-tight">{examples}</p>
      </div>
    </div>
  );
};

export default ComponentCard;
