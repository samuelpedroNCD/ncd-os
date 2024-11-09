import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  
  try {
    // First check localStorage
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state.theme;
    }
    
    // Then check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to dark theme
    return 'dark';
  } catch (e) {
    // Fallback to dark theme if there's an error
    return 'dark';
  }
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
