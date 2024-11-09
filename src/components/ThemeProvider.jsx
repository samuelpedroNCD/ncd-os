import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

export function ThemeProvider({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    try {
      // Remove both theme classes
      document.documentElement.classList.remove('light', 'dark');
      // Add current theme, defaulting to dark if something goes wrong
      document.documentElement.classList.add(theme || 'dark');
    } catch (e) {
      // Ensure dark theme is applied if there's an error
      document.documentElement.classList.add('dark');
      console.error('Error updating theme:', e);
    }
  }, [theme]);

  return children;
}
