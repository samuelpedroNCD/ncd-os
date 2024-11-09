import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getInitialTheme = () => {
  try {
    // Check if theme is stored in localStorage
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      return JSON.parse(stored).state.theme;
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) {
    // Default to dark theme if there's an error
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