import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  initTheme: () => void;
  cleanupTheme: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  darkMode: false,
  
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', String(newDarkMode));
      }
      
      // Update document class
      if (typeof document !== 'undefined') {
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      return { darkMode: newDarkMode };
    });
  },
  
  setDarkMode: (value: boolean) => {
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(value));
    }
    
    // Update document class
    if (typeof document !== 'undefined') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    set({ darkMode: value });
  },
  
  initTheme: () => {
    if (typeof window === 'undefined') return;
    
    // Get saved preference or use system preference as fallback
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply dark mode if needed
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    set({ darkMode: savedDarkMode });
    
    // Add storage event listener for cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode') {
        const newDarkMode = e.newValue === 'true';
        
        // Update theme
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        set({ darkMode: newDarkMode });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Store the listener on the window object for cleanup
    (window as any).__themeStorageListener = handleStorageChange;
  },
  
  cleanupTheme: () => {
    if (typeof window === 'undefined') return;
    
    // Remove storage event listener
    if ((window as any).__themeStorageListener) {
      window.removeEventListener('storage', (window as any).__themeStorageListener);
      delete (window as any).__themeStorageListener;
    }
  }
}));

export default useThemeStore; 