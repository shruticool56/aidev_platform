export interface MenuItemType {
  label: string;
  shortcut?: string;
  items?: MenuItemType[];
  divider?: boolean;
}

export interface MenuConfig {
  [key: string]: MenuItemType[];
}

export interface Tab {
  id: string;
  title: string;
  active: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  expanded?: boolean;
}

export interface StatusBarItem {
  id: string;
  text: string;
  icon?: string;
  position: 'left' | 'right';
}

export interface AppFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: AppFile[];
}

export interface TabItem {
  id: string;
  title: string;
  path: string;
  active: boolean;
}

// Expanded list of LLM providers based on architecture
export type LLMProviderType = 
  | 'openai' 
  | 'gemini' 
  | 'claude' 
  | 'mistral' 
  | 'deepseek' 
  | 'grok' 
  | 'qwen' 
  | 'openrouter' 
  | 'custom' 
  | 'ollama';

// Represents a specific model configuration
export interface LLMModelConfig {
  provider: LLMProviderType;
  modelId: string; // e.g., 'gpt-4o', 'claude-3-opus-20240229', 'llama3'
  apiKey?: string; // Only for external providers
  baseUrl?: string; // For 'custom' or 'openrouter'
}

// Represents an available Ollama model detected locally
export interface OllamaModel {
  name: string; // e.g., "llama3:latest"
  model: string; // e.g., "llama3:latest"
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

// Example structure for external models (can be expanded)
export const externalModels: { [key in Exclude<LLMProviderType, 'ollama' | 'custom'>]?: { id: string; name: string }[] } = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  ],
  gemini: [
    { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' },
  ],
  claude: [
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
  ],
  mistral: [
    { id: 'mistral-large-latest', name: 'Mistral Large' },
    { id: 'mistral-small-latest', name: 'Mistral Small' },
    { id: 'open-mixtral-8x7b', name: 'Mixtral 8x7B' },
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'Deepseek Chat' },
    { id: 'deepseek-coder', name: 'Deepseek Coder' },
  ],
  grok: [
      { id: 'grok-1', name: 'Grok-1' }, // Placeholder, actual IDs might differ
  ],
  qwen: [
      { id: 'qwen-turbo', name: 'Qwen Turbo' }, // Placeholder, actual IDs might differ
      { id: 'qwen-plus', name: 'Qwen Plus' },
  ],
  openrouter: [
      // Models available via OpenRouter - might need dynamic fetching or configuration
      { id: 'openrouter/auto', name: 'Auto (best price/latency)' },
  ],
};

