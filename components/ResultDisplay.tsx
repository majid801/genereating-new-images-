import React from 'react';

interface ResultDisplayProps {
  resultBase64: string | null;
  onDownload: () => void;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultBase64, onDownload, onReset }) => {
  if (!resultBase64) return null;

  return (
    <div className="w-full bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl animate-fade-in-up">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="text-green-400">●</span> Result
        </h3>
        <div className="flex gap-2">
           <button
            onClick={onReset}
            className="px-3 py-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
      
      <div className="relative p-2 bg-slate-900/50">
        <img 
          src={`data:image/jpeg;base64,${resultBase64}`} 
          alt="Generated Headshot" 
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-center">
        <button
          onClick={onDownload}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Image
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
