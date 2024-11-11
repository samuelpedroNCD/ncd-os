import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './components/ThemeProvider'
import './index.css'

// Get initial theme from storage or system preference
const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      return state.theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) {
    return 'dark';
  }
};

// Apply theme immediately to prevent flash
document.documentElement.classList.add(getInitialTheme());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
