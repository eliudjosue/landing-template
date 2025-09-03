'use client';

import React, { createContext, useContext, useEffect } from 'react';
import type { Theme } from '@/types/content';
import themeData from '@/content/theme.json';

const ThemeContext = createContext<Theme | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = themeData as Theme;

  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--brand', theme.colors.brand);
    root.style.setProperty('--bg', theme.colors.bg);
    root.style.setProperty('--fg', theme.colors.fg);
    root.style.setProperty('--muted', theme.colors.muted);
    root.style.setProperty('--card', theme.colors.card);
    root.style.setProperty('--radius-xl', theme.radii.xl);
    root.style.setProperty('--radius-lg', theme.radii.lg);
    root.style.setProperty('--radius-md', theme.radii.md);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}