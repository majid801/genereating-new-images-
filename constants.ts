import { HeadshotStyle } from './types';

export const APP_NAME = "AI Headshot Pro";
export const MODEL_NAME = "gemini-2.5-flash-image";

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Grey',
    description: 'Professional studio lighting with a neutral grey backdrop.',
    promptModifier: 'Make this a professional corporate headshot. Change the background to a clean, neutral studio grey. The subject should be wearing professional business attire (suit or blazer). Improve lighting to be soft and flattering studio lighting.',
    icon: '🏢'
  },
  {
    id: 'modern_tech',
    name: 'Modern Tech',
    description: 'Bright, modern office environment with depth of field.',
    promptModifier: 'Transform this into a modern tech industry headshot. Background should be a blurred, bright modern open-plan office with glass and light wood. Subject should wear smart-casual tech attire (e.g., high-quality t-shirt with blazer or crisp shirt).',
    icon: '💻'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Natural',
    description: 'Soft natural lighting with blurred nature background.',
    promptModifier: 'Change the setting to an outdoor portrait with soft, golden-hour natural lighting. Background should be blurred greenery or a park setting (bokeh effect). Subject should appear approachable and friendly.',
    icon: '🌳'
  },
  {
    id: 'studio_dark',
    name: 'Dramatic Dark',
    description: 'High contrast, moody lighting with dark background.',
    promptModifier: 'Create a dramatic, high-end studio portrait. Use a dark, textured charcoal background. Use rim lighting or chiaroscuro lighting techniques to highlight facial features. Professional and serious tone.',
    icon: '🎭'
  },
  {
    id: 'custom',
    name: 'Custom Prompt',
    description: 'Describe your own specific style or editing request.',
    promptModifier: '', // Populated by user input
    icon: '✨'
  }
];
