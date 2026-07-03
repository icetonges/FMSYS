'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'fmsys-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial = stored === 'light' ? 'light' : 'dark';
    setTheme(initial);
    setMounted(true);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const isLight = mounted && theme === 'light';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle dark and light mode"
      aria-pressed={isLight}
    >
      <span aria-hidden="true">{isLight ? '☀️' : '🌙'}</span>
      <span className="theme-toggle-label">{isLight ? 'Light' : 'Dark'}</span>
    </button>
  );
}
