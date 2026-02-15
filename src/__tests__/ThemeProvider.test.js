/**
 * @file Theme Provider Tests
 * @description Tests for ThemeProvider and useTheme hook
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import config from '../config';

// Mock config
jest.mock('../config', () => ({
  themeEnable: true,
  debug: false,
  colors: {
    light: {
      background: '#ffffff',
      foreground: '#feb272',
      gray: '#212529'
    },
    dark: {
      background: '#212020',
      foreground: '#feb272',
      gray: '#a9a9b3'
    }
  }
}));

// Test component that uses the theme
const TestComponent = () => {
  const { isDark, toggleTheme, themeEnabled } = useTheme();
  return (
    <div>
      <div data-testid="theme-enabled">{themeEnabled ? 'enabled' : 'disabled'}</div>
      <div data-testid="theme-value">{isDark ? 'dark' : 'light'}</div>
      <button data-testid="toggle-btn" onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    document.body.className = '';
  });

  it('should provide theme context to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-enabled').textContent).toBe('enabled');
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('should toggle theme when button is clicked', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');

    // Initially light
    expect(screen.getByTestId('theme-value').textContent).toBe('light');

    // Toggle to dark
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    // Toggle back to light
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });
  });

  it('should persist theme preference to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');

    // Toggle to dark
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(localStorage.getItem('blog-theme')).toBe('dark');
    });

    // Toggle back to light
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(localStorage.getItem('blog-theme')).toBe('light');
    });
  });

  it('should read theme preference from localStorage on mount', () => {
    // Set dark theme in localStorage
    localStorage.setItem('blog-theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
  });

  it('should apply dark class to body when dark theme is active', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');

    // Toggle to dark
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(document.body.classList.contains('dark-theme')).toBe(true);
      expect(document.body.classList.contains('light-theme')).toBe(false);
    });

    // Toggle back to light
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(document.body.classList.contains('light-theme')).toBe(true);
      expect(document.body.classList.contains('dark-theme')).toBe(false);
    });
  });

  it('should set CSS variables when theme changes', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');

    // Toggle to dark
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--bg-color')).toBe('#212020');
    });

    // Toggle back to light
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--bg-color')).toBe('#ffffff');
    });
  });
});

describe('ThemeProvider with themeEnable disabled', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Override the mock to disable theme change
    config.themeEnable = false;
  });

  afterEach(() => {
    config.themeEnable = true;
  });

  it('should show theme as disabled when themeEnable is false', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-enabled').textContent).toBe('disabled');
  });

  it('should not toggle theme when disabled', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');

    // Try to toggle - should stay light
    fireEvent.click(toggleBtn);
    await waitFor(() => {
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });
  });
});
