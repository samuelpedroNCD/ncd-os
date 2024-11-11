import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  
  try {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch (e) {
    return 'dark';
  }
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newTheme);
          }
          return { theme: newTheme };
        }),
    }),
    {
      name: 'theme-storage',
      getStorage: () => localStorage,
    }
  )
);
