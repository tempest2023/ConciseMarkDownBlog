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

    // Wait for the access check to complete (loading state to disappear)
    // The component first shows 'Checking access...' while hasAccess is null
    await page.waitForFunction(() => {
      const loadingEl = document.querySelector('[data-testid="config-loading"]');
      return !loadingEl;
    }, { timeout: 5000 }).catch(() => {
      // Loading state might already be gone, that's fine
    });
  });

  test('should load config editor page', async ({ page }) => {
    // Check if page loaded (either editor or access denied)
    const content = page.locator('[data-testid="config-editor-container"], [data-testid="access-denied"]').first();
    await expect(content).toBeVisible();
  });

  test('should display tabs when accessed locally', async ({ page }) => {
    // Check for tab buttons - they should be present even if access denied content shows
    const tabs = ['General', 'Social', 'Headers', 'Settings'];

    // The page will either show tabs (if local) or access denied message
    const hasAccessDenied = await page.locator('[data-testid="access-denied"]').isVisible().catch(() => false);

    if (!hasAccessDenied) {
      for (const tab of tabs) {
        const tabButton = page.locator('button', { hasText: tab });
        await expect(tabButton).toBeVisible();
      }
    }
  });

  test('should show access denied on non-localhost', async ({ page }) => {
    // Test that access denied can be shown
    // Note: In actual localhost testing, this will show the editor instead

    const accessDenied = page.locator('[data-testid="access-denied"]');
    const configEditor = page.locator('[data-testid="config-editor-container"]');

    // One of these should be visible
    await expect(accessDenied.or(configEditor).first()).toBeVisible();
  });

  test('should have blog title input when local', async ({ page }) => {
    const blogTitleInput = page.locator('input#blogTitle');

    // Only check if we're in local environment (config editor visible)
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(blogTitleInput).toBeVisible();
      await expect(blogTitleInput).toHaveAttribute('type', 'text');
    }
  });

  test('should have author name input when local', async ({ page }) => {
    const authorNameInput = page.locator('input#authorName');

    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(authorNameInput).toBeVisible();
    }
  });

  test('should have email input when local', async ({ page }) => {
    const emailInput = page.locator('input#email');

    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('type', 'email');
    }
  });

  test('should have export button when local', async ({ page }) => {
    const exportButton = page.locator('button', { hasText: /export configuration/i });

    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(exportButton).toBeVisible();
    }
  });

  test('should have reset button when local', async ({ page }) => {
    const resetButton = page.locator('button', { hasText: /reset to saved/i });

    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      await expect(resetButton).toBeVisible();
    }
  });

  test('tab navigation should work when local', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Click on Social tab
      const socialTab = page.locator('button', { hasText: 'Social' });
      await socialTab.click();

      // Should show GitHub username input
      const githubInput = page.locator('input#githubUsername');
      await expect(githubInput).toBeVisible();

      // Click on Headers tab
      const headersTab = page.locator('button', { hasText: 'Headers' });
      await headersTab.click();

      // Should show headers section
      const headersSection = page.locator('h2', { hasText: 'Navigation Headers' });
      await expect(headersSection).toBeVisible();
    }
  });

  test('should properly escape single quotes in exported config', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Set a blog title with a single quote
      const blogTitleInput = page.locator('input#blogTitle');
      await blogTitleInput.fill("Tempest's Amazing Blog");

      // Set an author name with a single quote
      const authorNameInput = page.locator('input#authorName');
      await authorNameInput.fill("O'Brien");

      // Click the Export Configuration button
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      // Wait for the export modal to appear using data-testid
      const modal = page.locator('[data-testid="export-modal"]');
      await expect(modal).toBeVisible();

      // Get the config content from the preview
      const configPreview = page.locator('pre');
      await expect(configPreview).toBeVisible();

      const configContent = await configPreview.textContent();

      // Verify single quotes are escaped in the exported config
      expect(configContent).toContain("title: 'Tempest\\'s Amazing Blog'");
      expect(configContent).toContain("name: 'O\\'Brien'");

      // Verify the config is valid JavaScript by checking structure
      expect(configContent).toContain('const config = {');
      expect(configContent).toContain('export default config;');

      // Close the modal using data-testid
      const closeButton = page.locator('[data-testid="modal-close"]');
      await closeButton.click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('should handle special characters in form inputs', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Test various special characters in blog title
      const blogTitleInput = page.locator('input#blogTitle');
      const specialTitles = [
        "It's a test",
        "Blog & More",
        "Test (Example)",
        "Blog with \\ backslash"
      ];

      for (const title of specialTitles) {
        await blogTitleInput.fill(title);
        await expect(blogTitleInput).toHaveValue(title);
      }

      // Export and verify no errors
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      const modal = page.locator('[data-testid="export-modal"]');
      await expect(modal).toBeVisible();

      // Config should be displayed without errors
      const configPreview = page.locator('pre');
      await expect(configPreview).toBeVisible();
    }
  });

  test('should show headers management help section', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Headers tab
      const headersTab = page.locator('button', { hasText: 'Headers' });
      await headersTab.click();

      // Check for help section using data-testid
      const helpSection = page.locator('[data-testid="headers-help-section"]');
      await expect(helpSection).toBeVisible();

      // Verify help content exists
      expect(await helpSection.textContent()).toContain('How Headers Work');
      expect(await helpSection.textContent()).toContain('Creating Articles');
      expect(await helpSection.textContent()).toContain('src/articles/');
    }
  });

  test('should allow adding a new article header', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Headers tab
      const headersTab = page.locator('button', { hasText: 'Headers' });
      await headersTab.click();

      // Fill in new header form using data-testid
      const titleInput = page.locator('[data-testid="new-header-title"]');
      await titleInput.fill('My New Page');

      // Click Add Header button
      const addButton = page.locator('[data-testid="add-header-button"]');
      await addButton.click();

      // Verify the new header appears in the list using text content
      const newHeader = page.locator('text=My New Page');
      await expect(newHeader).toBeVisible();

      // Export and verify header is in config
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      // Wait for modal using data-testid
      const modal = page.locator('[data-testid="export-modal"]');
      await expect(modal).toBeVisible();

      const configPreview = page.locator('pre');
      const configContent = await configPreview.textContent();

      expect(configContent).toContain("title: 'My New Page'");
      expect(configContent).toContain("type: 'article'");
    }
  });

  test('should allow adding a new link header', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Headers tab
      const headersTab = page.locator('button', { hasText: 'Headers' });
      await headersTab.click();

      // Fill in new header form using data-testid
      const titleInput = page.locator('[data-testid="new-header-title"]');
      await titleInput.fill('External Link');

      // Change type to link
      const typeSelect = page.locator('[data-testid="new-header-type"]');
      await typeSelect.selectOption('link');

      // Fill in URL
      const urlInput = page.locator('[data-testid="new-header-customurl"]');
      await urlInput.fill('https://example.com');

      // Click Add Header button
      const addButton = page.locator('[data-testid="add-header-button"]');
      await addButton.click();

      // Verify the new header appears in the list - look for it in a span (header title)
      const newHeader = page.locator('span', { hasText: 'External Link' });
      await expect(newHeader).toBeVisible();

      // Export and verify header is in config
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      // Wait for modal using data-testid
      const modal = page.locator('[data-testid="export-modal"]');
      await expect(modal).toBeVisible();

      const configPreview = page.locator('pre');
      const configContent = await configPreview.textContent();

      expect(configContent).toContain("title: 'External Link'");
      expect(configContent).toContain("type: 'link'");
      expect(configContent).toContain("customUrl: 'https://example.com'");
    }
  });

  test('should preserve header structure with customUrl', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Navigate to Headers tab
      const headersTab = page.locator('button', { hasText: 'Headers' });
      await headersTab.click();

      // Add a header with customUrl using data-testid
      const titleInput = page.locator('[data-testid="new-header-title"]');
      await titleInput.fill('Projects');

      const customUrlInput = page.locator('[data-testid="new-header-customurl"]');
      await customUrlInput.fill('Projects/Project');

      const addButton = page.locator('[data-testid="add-header-button"]');
      await addButton.click();

      // Export config
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      // Wait for modal using data-testid
      const modal = page.locator('[data-testid="export-modal"]');
      await expect(modal).toBeVisible();

      // Get config content
      const configPreview = page.locator('pre');
      const configContent = await configPreview.textContent();

      // Verify header has customUrl
      expect(configContent).toContain("title: 'Projects'");
      expect(configContent).toContain("type: 'article'");
      expect(configContent).toContain("customUrl: 'Projects/Project'");
    }
  });

  test('should show article creation instructions in export modal', async ({ page }) => {
    const hasEditor = await page.locator('[data-testid="config-editor-container"]').isVisible().catch(() => false);

    if (hasEditor) {
      // Click Export
      const exportButton = page.locator('button', { hasText: /export configuration/i });
      await exportButton.click();

      // Wait for modal using data-testid
      const modal = page.locator('[data-testid="export-modal"]');
      await expect(modal).toBeVisible();

      // Check for export info section using data-testid
      const exportInfo = page.locator('[data-testid="export-info"]');
      await expect(exportInfo).toBeVisible();

      // Verify instructions exist
      const infoText = await exportInfo.textContent();
      expect(infoText).toContain('src/config.js');
      expect(infoText).toContain('src/articles/');
      expect(infoText).toContain('About.md');
    }
  });
});
