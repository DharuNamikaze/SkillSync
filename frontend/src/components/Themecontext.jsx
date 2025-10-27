import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for theme management
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or default to 'system'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'system';
  });

  // Function to update theme
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Effect to apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // Remove any existing theme classes
      root.classList.remove('light-theme', 'dark-theme');
      
      let activeTheme = theme;
      
      // If system preference, check user's system settings
      if (theme === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Apply the appropriate theme class
      root.classList.add(`${activeTheme}-theme`);
    };
    
    applyTheme();
    
    // Listen for system preference changes if using system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};