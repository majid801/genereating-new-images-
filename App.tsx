import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import { generateHeadshot } from './services/geminiService';
import { HEADSHOT_STYLES, APP_NAME } from './constants';
import { ImageFile, GenerationState } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(HEADSHOT_STYLES[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>({ status: 'idle' });

  const handleImageSelected = useCallback((image: ImageFile) => {
    setSelectedImage(image);
    setGeneratedImage(null);
    setGenerationState({ status: 'idle' });
  }, []);

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setGenerationState({ status: 'processing' });
    setGeneratedImage(null);

    try {
      let prompt = '';
      const style = HEADSHOT_STYLES.find(s => s.id === selectedStyleId);
      
      if (selectedStyleId === 'custom') {
        if (!customPrompt.trim()) {
            setGenerationState({ status: 'error', errorMessage: 'Please enter a description for your custom style.' });
            return;
        }
        prompt = customPrompt;
      } else if (style) {
        prompt = style.promptModifier;
      }

      const resultBase64 = await generateHeadshot(
        selectedImage.base64,
        selectedImage.mimeType,
        prompt
      );

      setGeneratedImage(resultBase64);
      setGenerationState({ status: 'completed' });
    } catch (error: any) {
      console.error(error);
      setGenerationState({ 
        status: 'error', 
        errorMessage: error.message || "Failed to generate image. Please try again." 
      });
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${generatedImage}`;
      link.download = `headshot-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setGenerationState({ status: 'idle' });
    setCustomPrompt('');
    setSelectedStyleId(HEADSHOT_STYLES[0].id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 text-slate-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight">{APP_NAME}</h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">1. Upload Selfie</h2>
                {selectedImage && (
                  <button onClick={handleReset} className="text-sm text-red-400 hover:text-red-300">
                    Clear
                  </button>
                )}
              </div>
              <ImageUploader 
                onImageSelected={handleImageSelected}
                selectedImage={selectedImage}
              />
            </section>

            {selectedImage && (
              <section className="animate-fade-in">
                <h2 className="text-lg font-semibold text-white mb-4">2. Choose Style</h2>
                <StyleSelector 
                  selectedStyleId={selectedStyleId}
                  onSelectStyle={setSelectedStyleId}
                  customPrompt={customPrompt}
                  onCustomPromptChange={setCustomPrompt}
                  disabled={generationState.status === 'processing'}
                />

                <div className="mt-8 sticky bottom-6 z-40">
                  <button
                    onClick={handleGenerate}
                    disabled={generationState.status === 'processing'}
                    className={`
                      w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all
                      flex items-center justify-center gap-3
                      ${generationState.status === 'processing'
                        ? 'bg-slate-700 text-slate-400 cursor-wait'
                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/25 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {generationState.status === 'processing' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Generate Headshot
                      </>
                    )}
                  </button>
                  {generationState.status === 'error' && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                      {generationState.errorMessage}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Preview/Result */}
          <div className="lg:col-span-7">
             <div className="sticky top-24 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center justify-between">
                  <span>3. Result</span>
                  {generationState.status === 'completed' && <span className="text-sm font-normal text-green-400">Generation Complete</span>}
                </h2>
                
                {generationState.status === 'idle' && !generatedImage && (
                  <div className="h-[500px] border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-20 h-20 rounded-full bg-slate-800 mb-4 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                    </div>
                    <p>Your professional headshot will appear here</p>
                  </div>
                )}

                {generationState.status === 'processing' && (
                   <div className="h-[500px] border border-slate-700 rounded-xl bg-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 animate-pulse"></div>
                      <div className="flex gap-2 mb-4">
                        <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                        <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      </div>
                      <p className="text-indigo-300 font-medium z-10">Transforming your image...</p>
                      <p className="text-slate-500 text-sm mt-2 z-10">This uses advanced AI and may take a few seconds.</p>
                   </div>
                )}

                {generatedImage && (
                  <ResultDisplay 
                    resultBase64={generatedImage} 
                    onDownload={handleDownload}
                    onReset={() => {
                        setGeneratedImage(null);
                        setGenerationState({ status: 'idle' });
                    }}
                  />
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
