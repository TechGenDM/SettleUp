import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import CustomButton from './CustomButton';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Lazy initializer reads localStorage synchronously, preventing the flash
    // of the wrong icon that occurred when useEffect ran after first render.
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <CustomButton 
      variant="ghost" 
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-glass-border bg-bg-secondary text-text-muted hover:text-brand-primary"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </CustomButton>
  );
};

export default ThemeToggle;
