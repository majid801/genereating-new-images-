import React, { useRef } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageFile) => void;
  selectedImage: ImageFile | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract pure base64 (remove data:image/xxx;base64, prefix)
      const base64 = result.split(',')[1];
      
      onImageSelected({
        file,
        previewUrl: result,
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      {!selectedImage ? (
        <div 
          onClick={triggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-600 hover:border-indigo-500 hover:bg-slate-800/50 transition-all rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer min-h-[300px] text-center"
        >
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Upload your selfie</h3>
          <p className="text-slate-400 mb-6">Drag and drop or click to browse</p>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Select Photo
          </button>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-xl group">
          <img 
            src={selectedImage.previewUrl} 
            alt="Original" 
            className="w-full h-auto max-h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
              onClick={triggerFileInput}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full hover:bg-white/20 transition"
             >
               Change Photo
             </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
             <p className="text-white text-sm font-medium">Original Image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
