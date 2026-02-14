/**
 * @file Theme Application Utility
 * @description Applies theme colors from config to CSS variables
 */

import config from '../config';

/**
 * Applies theme colors to CSS custom properties
 * @param {Object} colors - Colors object with light and dark properties
 */
export function applyThemeColors (colors = config.colors) {
  if (!colors || typeof document === 'undefined') return;

  const root = document.documentElement;

  // Apply light mode colors
  if (colors.light) {
    root.style.setProperty('--bg-color', colors.light.background);
    root.style.setProperty('--fg-color', colors.light.foreground);
    root.style.setProperty('--gray-color', colors.light.gray);
    root.style.setProperty('--text-color', colors.light.gray);
  }

  // Note: Dark mode colors are handled via media query or class toggle
  // The actual dark mode implementation depends on the existing theme system
}

/**
 * Gets the current theme colors from CSS variables
 * @returns {Object} Current theme colors
 */
export function getCurrentThemeColors () {
  if (typeof document === 'undefined') return null;

  const root = getComputedStyle(document.documentElement);

  return {
    background: root.getPropertyValue('--bg-color').trim(),
    foreground: root.getPropertyValue('--fg-color').trim(),
    gray: root.getPropertyValue('--gray-color').trim()
  };
}

/**
 * Checks if dark mode is currently active
 * @returns {boolean}
 */
export function isDarkMode () {
  if (typeof document === 'undefined') return false;

  // Check for dark mode class or media query
  return document.documentElement.classList.contains('dark') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
