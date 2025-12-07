import React from 'react';
import { HEADSHOT_STYLES } from '../constants';
import { HeadshotStyle } from '../types';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  disabled: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
  customPrompt,
  onCustomPromptChange,
  disabled
}) => {
  const isCustom = selectedStyleId === 'custom';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HEADSHOT_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl text-left transition-all border
              ${selectedStyleId === style.id 
                ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{style.icon}</span>
              {selectedStyleId === style.id && (
                <span className="h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
            <h3 className={`font-semibold ${selectedStyleId === style.id ? 'text-indigo-300' : 'text-slate-200'}`}>
              {style.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {style.description}
            </p>
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="animate-fade-in space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Describe your desired edit
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            disabled={disabled}
            placeholder="E.g., Make me look like a superhero, add a retro filter, remove the background..."
            className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>
      )}
    </div>
  );
};

export default StyleSelector;
