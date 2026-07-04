'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'fmsys-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const isLight = theme === 'light';
  const label = isLight ? 'Light' : 'Dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle dark and light mode"
      aria-pressed={isLight}
    >
      <span aria-hidden="true">{label}</span>
      <span className="theme-toggle-label">{label}</span>
    </button>
  );
}
