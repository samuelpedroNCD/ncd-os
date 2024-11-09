import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

export function ThemeProvider({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    try {
      // Remove both theme classes
      document.documentElement.classList.remove('light', 'dark');
      // Add current theme
      document.documentElement.classList.add(theme);
    } catch (e) {
      console.error('Error updating theme:', e);
    }
  }, [theme]);

  return children;
}