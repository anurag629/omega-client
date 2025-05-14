import { create } from 'zustand';
import api from '@/lib/api';

export interface ManimScript {
  id: string;
  prompt: string;
  script: string;
  provider: 'gemini' | 'azure_openai';
  script_path: string | null;
  output_path: string | null;
  output_url: string | null;
  status: 'pending' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

interface ScriptsState {
  scripts: ManimScript[];
  currentScript: ManimScript | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchScripts: () => Promise<void>;
  fetchScript: (id: string) => Promise<void>;
  generateScript: (data: {
    prompt: string;
    provider: 'gemini' | 'azure_openai';
    execute?: boolean;
  }) => Promise<ManimScript | null>;
  clearCurrentScript: () => void;
}

const useScriptsStore = create<ScriptsState>((set, get) => ({
  scripts: [],
  currentScript: null,
  isLoading: false,
  error: null,
  
  // Fetch all scripts
  fetchScripts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.getScripts();
      set({
        scripts: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch scripts',
      });
    }
  },
  
  // Fetch a single script by ID
  fetchScript: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.getScript(id);
      set({
        currentScript: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch script',
      });
    }
  },
  
  // Generate a new script
  generateScript: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.generateScript(data);
      
      const newScript = response.data;
      
      // Add to scripts list
      set((state) => ({
        scripts: [newScript, ...state.scripts],
        currentScript: newScript,
        isLoading: false,
      }));
      
      return newScript;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to generate script',
      });
      return null;
    }
  },
  
  // Clear current script
  clearCurrentScript: () => {
    set({ currentScript: null });
  },
}));

export default useScriptsStore; 