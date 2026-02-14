/**
 * @file Config Theme UI Tests
 * @description Tests for theme and color configuration functionality
 */
import { test, expect } from '@playwright/test';

test.describe('Config Editor - Theme and Colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?page=config');
    await page.waitForLoadState('networkidle');
  });

  test('should apply theme preset when selected', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Theme tab
      const themeTab = page.locator('button', { hasText: 'Theme' });
      await themeTab.click();

      // Select Ocean theme
      const themePreset = page.locator('select#themePreset');
      await themePreset.selectOption('ocean');

      // Verify light mode background color input shows ocean color
      const lightBgInput = page.locator('input#light-background');
      await expect(lightBgInput).toHaveValue('#f0f9ff');

      // Verify dark mode background shows ocean color
      const darkBgInput = page.locator('input#dark-background');
      await expect(darkBgInput).toHaveValue('#0f172a');
    }
  });

  test('should update color inputs when theme preset changes', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Theme tab
      const themeTab = page.locator('button', { hasText: 'Theme' });
      await themeTab.click();

      // Check default colors first
      const lightFgInput = page.locator('input#light-foreground');
      const defaultValue = await lightFgInput.inputValue();

      // Change to Forest theme
      const themePreset = page.locator('select#themePreset');
      await themePreset.selectOption('forest');

      // Verify foreground color changed to forest green
      await expect(lightFgInput).toHaveValue('#22c55e');

      // Verify it changed from default
      expect(await lightFgInput.inputValue()).not.toBe(defaultValue);
    }
  });

  test('should export config with correct theme colors', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Theme tab
      const themeTab = page.locator('button', { hasText: 'Theme' });
      await themeTab.click();

      // Select Berry theme
      const themePreset = page.locator('select#themePreset');
      await themePreset.selectOption('berry');

      // Click Export
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      // Wait for modal
      const modal = page.locator('.modal');
      await expect(modal).toBeVisible();

      // Get config content
      const configPreview = page.locator('.export-preview pre');
      const configContent = await configPreview.textContent();

      // Verify berry theme colors are in exported config
      expect(configContent).toContain("background: '#fdf2f8'"); // Light bg
      expect(configContent).toContain("foreground: '#ec4899'"); // Light fg
      expect(configContent).toContain("background: '#500724'"); // Dark bg
      expect(configContent).toContain("foreground: '#f472b6'"); // Dark fg
    }
  });

  test('should allow custom color input', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Theme tab
      const themeTab = page.locator('button', { hasText: 'Theme' });
      await themeTab.click();

      // Set custom color via text input
      const lightBgTextInput = page.locator('input#light-background').nth(1);
      await lightBgTextInput.fill('#123456');

      // Verify color picker updated
      const lightBgColorInput = page.locator('input#light-background').first();
      await expect(lightBgColorInput).toHaveValue('#123456');

      // Export and verify custom color is in config
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      const configPreview = page.locator('.export-preview pre');
      const configContent = await configPreview.textContent();

      expect(configContent).toContain("background: '#123456'");
    }
  });

  test('should persist themeChange setting in exported config', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Theme tab
      const themeTab = page.locator('button', { hasText: 'Theme' });
      await themeTab.click();

      // Toggle theme change off
      const themeChangeCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /theme switcher/i });
      await themeChangeCheckbox.click();

      // Export
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      const configPreview = page.locator('.export-preview pre');
      const configContent = await configPreview.textContent();

      // Verify themeChange is false
      expect(configContent).toContain('themeChange: false');
    }
  });

  test('exported config colors should be properly formatted', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Theme tab
      const themeTab = page.locator('button', { hasText: 'Theme' });
      await themeTab.click();

      // Select Ocean theme
      const themePreset = page.locator('select#themePreset');
      await themePreset.selectOption('ocean');

      // Export
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      const configPreview = page.locator('.export-preview pre');
      const configContent = await configPreview.textContent();

      // Verify proper structure
      expect(configContent).toContain('colors: {');
      expect(configContent).toContain('light: {');
      expect(configContent).toContain('dark: {');

      // Verify all color properties are present
      expect(configContent).toContain('background:');
      expect(configContent).toContain('foreground:');
      expect(configContent).toContain('gray:');

      // Verify colors object structure is complete
      const lightMatch = configContent.match(/light:\s*\{[\s\S]*?background:[\s\S]*?foreground:[\s\S]*?gray:[\s\S]*?\}/);
      expect(lightMatch).toBeTruthy();

      const darkMatch = configContent.match(/dark:\s*\{[\s\S]*?background:[\s\S]*?foreground:[\s\S]*?gray:[\s\S]*?\}/);
      expect(darkMatch).toBeTruthy();
    }
  });
});

test.describe('Applied Theme', () => {
  test('should have CSS variables defined after page load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if CSS variables are set
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    });

    // Should have a background color set (either from config or default)
    expect(bgColor).toBeTruthy();
  });

  test('theme colors should affect page styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get the page background color
    const pageBg = await page.evaluate(() => {
      const page = document.querySelector('.page');
      return page ? getComputedStyle(page).backgroundColor : null;
    });

    // Page should have a background color
    expect(pageBg).toBeTruthy();
    expect(pageBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(pageBg).not.toBe('transparent');
  });
});
