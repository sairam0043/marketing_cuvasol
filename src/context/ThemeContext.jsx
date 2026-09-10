import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  { id: 'light', name: 'Day Mode', icon: '☀️', bg: '#FAF8F5', primary: '#1B9382' },
  { id: 'dark-midnight', name: 'Midnight Blue', icon: '🌙', bg: '#080e1a', primary: '#2dd4bf' },
  { id: 'dark-oled', name: 'OLED Black', icon: '🖤', bg: '#000000', primary: '#2dd4bf' },
  { id: 'dark-forest', name: 'Forest Green', icon: '🌲', bg: '#06130b', primary: '#22c55e' },
  { id: 'dark-purple', name: 'Royal Purple', icon: '👑', bg: '#0d0718', primary: '#a855f7' },
  { id: 'dark-sunset', name: 'Sunset Terracotta', icon: '🌅', bg: '#170a06', primary: '#f97316' },
  { id: 'dark-ocean', name: 'Ocean Wave', icon: '🌊', bg: '#05131a', primary: '#0ea5e9' },
  { id: 'dark-nordic', name: 'Nordic Frost', icon: '❄️', bg: '#0d1520', primary: '#38bdf8' },
  { id: 'dark-neon', name: 'Cyberpunk Neon', icon: '⚡', bg: '#100517', primary: '#ec4899' },
];

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('cuvasol_theme') || 'light';
  });

  useEffect(() => {
    // Apply theme class and data-theme attribute on root HTML element
    const root = document.documentElement;
    THEMES.forEach(t => root.classList.remove(t.id));
    if (theme !== 'light') {
      root.classList.add(theme);
    }
    root.setAttribute('data-theme', theme);
    localStorage.setItem('cuvasol_theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark-midnight' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
