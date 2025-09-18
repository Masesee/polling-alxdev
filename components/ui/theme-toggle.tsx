'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<('light' | 'dark')>(() => {
    if (typeof window !== 'undefined') {
      const persisted = window.localStorage.getItem('theme') as 'light' | 'dark' | null;
      return persisted || 'light';
    }
    return 'light';
  });

  const applyTheme = (t: 'light' | 'dark') => {
    const root = document.documentElement;
    const body = document.body;
    if (t === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    window.localStorage.setItem('theme', t);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === 'dark' ? (
        <span aria-hidden>🌙</span>
      ) : (
        <span aria-hidden>☀️</span>
      )}
      <span suppressHydrationWarning>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}


