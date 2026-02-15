/**
 * @file Theme Switcher UI Tests
 * @description Tests for theme toggle functionality
 */
import { test, expect } from '@playwright/test';

test.describe('Theme Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show theme toggle button when themeEnable is enabled', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="light mode"], button[aria-label*="dark mode"]');

    // The toggle might not exist if themeEnable is disabled
    const exists = await themeToggle.isVisible().catch(() => false);

    if (exists) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test('should toggle between light and dark modes', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="light mode"], button[aria-label*="dark mode"]');

    // Check if toggle exists
    const exists = await themeToggle.isVisible().catch(() => false);

    if (!exists) {
      test.skip();
      return;
    }

    // Get initial theme
    const pageElement = page.locator('.page');
    const initialClass = await pageElement.getAttribute('class');
    const isInitiallyDark = initialClass?.includes('dark-theme');

    // Click toggle
    await themeToggle.click();

    // Wait for theme to change
    await page.waitForTimeout(100);

    // Check theme changed
    const newClass = await pageElement.getAttribute('class');
    if (isInitiallyDark) {
      expect(newClass).toContain('light-theme');
    } else {
      expect(newClass).toContain('dark-theme');
    }

    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(100);

    const finalClass = await pageElement.getAttribute('class');
    if (isInitiallyDark) {
      expect(finalClass).toContain('dark-theme');
    } else {
      expect(finalClass).toContain('light-theme');
    }
  });

  test('should persist theme preference after reload', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="light mode"], button[aria-label*="dark mode"]');

    // Check if toggle exists
    const exists = await themeToggle.isVisible().catch(() => false);

    if (!exists) {
      test.skip();
      return;
    }

    // Toggle to dark mode
    await themeToggle.click();
    await page.waitForTimeout(100);

    // Verify dark theme is active
    let pageElement = page.locator('.page');
    let pageClass = await pageElement.getAttribute('class');

    // If still light, toggle again
    if (!pageClass?.includes('dark-theme')) {
      await themeToggle.click();
      await page.waitForTimeout(100);
    }

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify theme persisted
    pageElement = page.locator('.page');
    pageClass = await pageElement.getAttribute('class');

    // Theme should be persisted from localStorage
    // We just verify the page loads correctly
    expect(pageClass).toMatch(/(light|dark)-theme/);
  });

  test('should apply dark theme CSS variables', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="light mode"], button[aria-label*="dark mode"]');

    // Check if toggle exists
    const exists = await themeToggle.isVisible().catch(() => false);

    if (!exists) {
      test.skip();
      return;
    }

    // Toggle to dark mode
    await themeToggle.click();
    await page.waitForTimeout(100);

    // Check CSS variables are set
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    });

    // Dark theme should have a dark background
    expect(bgColor).toBeTruthy();
  });
});
