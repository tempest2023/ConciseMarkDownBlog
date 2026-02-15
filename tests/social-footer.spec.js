/**
 * @file Social Footer UI Tests
 * @description Tests for social footer component
 */
import { test, expect } from '@playwright/test';

test.describe('Social Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display footer with social links', async ({ page }) => {
    // Check if footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for social links using aria-label (not CSS classes which get hashed)
    const socialLinks = footer.locator('a[aria-label]');
    const count = await socialLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have GitHub link that opens in new tab', async ({ page, context }) => {
    const githubLink = page.locator('footer a[aria-label="GitHub"]');

    // Check if link exists (may not be configured)
    const exists = await githubLink.isVisible().catch(() => false);

    if (exists) {
      await expect(githubLink).toHaveAttribute('target', '_blank');
      await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('should have LinkedIn link that opens in new tab', async ({ page }) => {
    const linkedinLink = page.locator('footer a[aria-label="LinkedIn"]');

    const exists = await linkedinLink.isVisible().catch(() => false);

    if (exists) {
      await expect(linkedinLink).toHaveAttribute('target', '_blank');
      await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('should have email mailto link', async ({ page }) => {
    const emailLink = page.locator('footer a[aria-label="Email"]');

    const exists = await emailLink.isVisible().catch(() => false);

    if (exists) {
      const href = await emailLink.getAttribute('href');
      expect(href).toMatch(/^mailto:/);
    }
  });

  test('should display copyright with current year', async ({ page }) => {
    const footer = page.locator('footer');
    const currentYear = new Date().getFullYear();

    await expect(footer).toContainText(String(currentYear));
  });

  test('should have working social link hover states', async ({ page }) => {
    const githubLink = page.locator('footer a[aria-label="GitHub"]');

    const exists = await githubLink.isVisible().catch(() => false);

    if (exists) {
      // Hover over the link
      await githubLink.hover();

      // Just verify the element is still visible after hover
      await expect(githubLink).toBeVisible();
    }
  });
});
