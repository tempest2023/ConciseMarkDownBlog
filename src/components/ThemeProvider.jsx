/**
 * @file Theme Provider Component
 * @description Provides global theme state (light/dark mode) for the blog
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import config from '../config';

// Create theme context
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  themeEnabled: false
});

/**
 * Hook to access theme context
 * @returns {Object} Theme context with isDark, toggleTheme, themeEnabled
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * Theme Provider Component
 * Manages theme state and persists preference to localStorage
 */
export const ThemeProvider = ({ children }) => {
  // Check if theme change is enabled in config
  const themeEnabled = config.themeEnable !== false;

  // Get initial theme from localStorage or default to light
  const getInitialTheme = useCallback(() => {
    if (!themeEnabled) return false;
    const stored = localStorage.getItem('blog-theme');
    if (stored) {
      return stored === 'dark';
    }
    return false;
  }, [themeEnabled]);

  const [isDark, setIsDark] = useState(getInitialTheme);

  // Apply theme colors to CSS variables
  useEffect(() => {
    const colors = isDark ? config.colors?.dark : config.colors?.light;
    if (colors) {
      // Main colors
      document.documentElement.style.setProperty('--bg-color', colors.background || (isDark ? '#212529' : '#ffffff'));
      document.documentElement.style.setProperty('--text-color', colors.text || (isDark ? '#f8f9fa' : '#212529'));
      document.documentElement.style.setProperty('--accent-color', colors.foreground || '#0077ff');
      document.documentElement.style.setProperty('--heading-color', colors.text || (isDark ? '#f8f9fa' : '#212529'));
      document.documentElement.style.setProperty('--muted-color', colors.gray || (isDark ? '#adb5bd' : '#6c757d'));
      document.documentElement.style.setProperty('--border-color', colors.border || (isDark ? '#495057' : '#dee2e6'));
      document.documentElement.style.setProperty('--card-bg', colors.cardBg || (isDark ? '#343a40' : '#f8f9fa'));
      document.documentElement.style.setProperty('--code-bg', isDark ? '#2d2d2d' : '#f8f9fa');
      document.documentElement.style.setProperty('--input-bg', isDark ? '#495057' : '#ffffff');
      // Link colors
      document.documentElement.style.setProperty('--link-color', isDark ? '#6ea8fe' : '#0d6efd');
      document.documentElement.style.setProperty('--link-hover-color', isDark ? '#8bb9fe' : '#0a58ca');
      // Button colors
      document.documentElement.style.setProperty('--btn-primary-bg', colors.foreground || '#0d6efd');
      document.documentElement.style.setProperty('--btn-secondary-bg', isDark ? '#495057' : '#6c757d');
      // Secondary backgrounds for cards, blocks
      document.documentElement.style.setProperty('--bg-secondary', colors.cardBg || (isDark ? '#343a40' : '#f8f9fa'));
    }

    // Apply dark class to body for CSS targeting
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    if (!themeEnabled) return;
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('blog-theme', newTheme ? 'dark' : 'light');
    if (config.debug) {
      console.log('[debug] Theme switched to:', newTheme ? 'dark' : 'light');
    }
  }, [isDark, themeEnabled]);

  const value = {
    isDark,
    toggleTheme,
    themeEnabled
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ThemeProvider;
