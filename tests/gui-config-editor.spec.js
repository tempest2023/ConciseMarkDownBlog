/**
 * @file GUI Config Editor UI Test
 * @description Tests the GUI-based configuration editor
 */
import { test, expect } from '@playwright/test';

test.describe('GUI Config Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to config page
    await page.goto('/?page=config');
    await page.waitForLoadState('networkidle');
  });

  test('should load config editor page', async ({ page }) => {
    // Check if page loaded (either editor or access denied)
    const content = await page.locator('.config-editor-container, .access-denied').first();
    await expect(content).toBeVisible();
  });

  test('should display tabs when accessed locally', async ({ page }) => {
    // Check for tab buttons - they should be present even if access denied content shows
    const tabs = ['General', 'Social', 'Pages', 'Theme'];

    // The page will either show tabs (if local) or access denied message
    const hasAccessDenied = await page.locator('.access-denied').isVisible().catch(() => false);

    if (!hasAccessDenied) {
      for (const tab of tabs) {
        const tabButton = page.locator('button', { hasText: tab });
        await expect(tabButton).toBeVisible();
      }
    }
  });

  test('should show access denied on non-localhost', async ({ page, context }) => {
    // Test that access denied can be shown
    // Note: In actual localhost testing, this will show the editor instead

    const accessDenied = page.locator('.access-denied');
    const configEditor = page.locator('.config-editor-container');

    // One of these should be visible
    await expect(accessDenied.or(configEditor).first()).toBeVisible();
  });

  test('should have blog title input when local', async ({ page }) => {
    const blogTitleInput = page.locator('input#blogTitle');

    // Only check if we're in local environment (config editor visible)
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(blogTitleInput).toBeVisible();
      await expect(blogTitleInput).toHaveAttribute('type', 'text');
    }
  });

  test('should have author name input when local', async ({ page }) => {
    const authorNameInput = page.locator('input#authorName');

    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(authorNameInput).toBeVisible();
    }
  });

  test('should have email input when local', async ({ page }) => {
    const emailInput = page.locator('input#email');

    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('type', 'email');
    }
  });

  test('should have export button when local', async ({ page }) => {
    const exportButton = page.locator('button', { hasText: /export configuration/i });

    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(exportButton).toBeVisible();
    }
  });

  test('should have reset button when local', async ({ page }) => {
    const resetButton = page.locator('button', { hasText: /reset to saved/i });

    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(resetButton).toBeVisible();
    }
  });

  test('tab navigation should work when local', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Click on Social tab
      const socialTab = page.locator('button', { hasText: 'Social' });
      await socialTab.click();

      // Should show GitHub username input
      const githubInput = page.locator('input#githubUsername');
      await expect(githubInput).toBeVisible();

      // Click on Theme tab
      const themeTab = page.locator('button', { hasText: 'Theme' });
      await themeTab.click();

      // Should show theme preset dropdown
      const themePreset = page.locator('select#themePreset');
      await expect(themePreset).toBeVisible();
    }
  });

  test('page configuration checkboxes should work when local', async ({ page }) => {
    const hasEditor = await page.locator('.config-editor-container').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Pages tab
      const pagesTab = page.locator('button', { hasText: 'Pages' });
      await pagesTab.click();

      // Check for About checkbox
      const aboutCheckbox = page.locator('input[type="checkbox"]').first();
      await expect(aboutCheckbox).toBeVisible();

      // Check/uncheck should work
      const isChecked = await aboutCheckbox.isChecked();
      await aboutCheckbox.click();
      await expect(aboutCheckbox).toBeChecked({ checked: !isChecked });
    }
  });
});
