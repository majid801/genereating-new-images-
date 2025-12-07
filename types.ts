export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  icon: string;
}

export interface GenerationState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string; // Pure base64 data without prefix
  mimeType: string;
}
