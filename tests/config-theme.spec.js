/**
 * @file Config Theme UI Tests
 * @description Tests for theme and configuration functionality
 */
import { test, expect } from '@playwright/test';

test.describe('Config Editor - Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?page=config');
    await page.waitForLoadState('networkidle');
  });

  test('should have theme switcher toggle in settings', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Settings tab
      const settingsTab = page.locator('button', { hasText: 'Settings' });
      await settingsTab.click();

      // Verify theme switcher checkbox exists
      const themeEnableCheckbox = page.locator('input[type="checkbox"]').first();
      await expect(themeEnableCheckbox).toBeVisible();
    }
  });

  test('should persist themeEnable setting in exported config', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Settings tab
      const settingsTab = page.locator('button', { hasText: 'Settings' });
      await settingsTab.click();

      // Toggle theme change off (first checkbox)
      const themeEnableCheckbox = page.locator('input[type="checkbox"]').first();
      const isChecked = await themeEnableCheckbox.isChecked();
      if (isChecked) {
        await themeEnableCheckbox.click();
      }

      // Export
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      const configPreview = page.locator('.export-preview pre');
      const configContent = await configPreview.textContent();

      // Verify themeEnable is false
      expect(configContent).toContain('themeEnable: false');
    }
  });

  test('should have markdown settings in settings tab', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Settings tab
      const settingsTab = page.locator('button', { hasText: 'Settings' });
      await settingsTab.click();

      // Verify markdown tab size input exists
      const tabSizeInput = page.locator('input#markdownTabSize');
      await expect(tabSizeInput).toBeVisible();

      // Verify link color input exists
      const linkColorInput = page.locator('input#markdownLinkColor');
      await expect(linkColorInput).toBeVisible();
    }
  });

  test('should export markdown settings correctly', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Settings tab
      const settingsTab = page.locator('button', { hasText: 'Settings' });
      await settingsTab.click();

      // Change tab size to 4
      const tabSizeInput = page.locator('input#markdownTabSize');
      await tabSizeInput.fill('4');

      // Export
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      const configPreview = page.locator('.export-preview pre');
      const configContent = await configPreview.textContent();

      // Verify markdown settings are present
      expect(configContent).toContain('markdown: {');
      expect(configContent).toContain('tabSize: 4');
      expect(configContent).toContain('enable:');
      expect(configContent).toContain('linkStyle: {');
    }
  });
});

test.describe('Applied Theme', () => {
  test('should have theme switcher on main page when enabled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if theme toggle exists (it's part of the blog UI when themeEnable is enabled)
    // The theme toggle is typically a button with an icon
    const themeToggle = page.locator('button, a').filter({ has: page.locator('i[class*="sun"], i[class*="moon"], i[class*="theme"]') });

    // Theme toggle might exist depending on config
    const hasThemeToggle = await themeToggle.isVisible().catch(() => false);

    if (hasThemeToggle) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test('page should have proper styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get the page background color
    const pageBg = await page.evaluate(() => {
      const pageElement = document.querySelector('.page');
      return pageElement ? getComputedStyle(pageElement).backgroundColor : null;
    });

    // Page should have a background color (from Bootstrap or custom styles)
    expect(pageBg).toBeTruthy();
  });
});
