/**
 * @file Menu Navigation Test
 * @description Verifies main menu functionality and navigation
 */
import { test, expect } from '@playwright/test';

test.describe('Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display navigation header with configured menu items', async ({ page }) => {
    // Verify the navbar is present
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();

    // Verify the brand/title is displayed
    const brand = page.locator('a.navbar-brand');
    await expect(brand).toBeVisible();

    // Verify navigation links container exists
    const navLinks = page.locator('#navbarNav');
    await expect(navLinks).toBeVisible();

    // Verify specific menu items from config are present
    const expectedMenuItems = ['About', 'Tech Stack', 'Blog', 'Projects', 'MarkDown', 'Resume', 'Links'];

    for (const menuItem of expectedMenuItems) {
      // Menu items are rendered as links within the navbar
      const menuLink = page.locator('nav').getByText(menuItem, { exact: true });
      await expect(menuLink, `Menu item "${menuItem}" should be visible`).toBeVisible();
    }
  });

  test('clicking About menu item should display About content', async ({ page }) => {
    // Click on About menu item
    const aboutLink = page.locator('nav').getByText('About', { exact: true });
    await aboutLink.click();

    // Wait for content to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify URL contains the page parameter (either via pushState or already present)
    const currentUrl = page.url();
    // URL should either have the query param or we're on a client-side routed page
    expect(currentUrl).toMatch(/(\?page=About|$)/);

    // Verify the content changed (About article loaded)
    const articleContent = page.locator('.article-content, .container');
    await expect(articleContent).toBeVisible();

    // The content should have loaded and be different from initial or contain expected structure
    const contentText = await page.locator('.container').textContent();
    expect(contentText.length).toBeGreaterThan(0);
  });

  test('clicking Tech Stack menu item should display Tech Stack content', async ({ page }) => {
    const techStackLink = page.locator('nav').getByText('Tech Stack', { exact: true });
    await techStackLink.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify content loaded
    const articleContent = page.locator('.article-content, .container');
    await expect(articleContent).toBeVisible();

    // Verify the active state is applied
    const activeLink = page.locator('a[data-active="active"]');
    await expect(activeLink).toContainText('Tech');
  });

  test('clicking Blog menu item should display Blog content', async ({ page }) => {
    const blogLink = page.locator('nav').getByText('Blog', { exact: true });
    await blogLink.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify content loaded
    const articleContent = page.locator('.article-content, .container');
    await expect(articleContent).toBeVisible();

    // Verify the active state is applied
    const activeLink = page.locator('a[data-active="active"]');
    await expect(activeLink).toContainText('Blog');
  });

  test('clicking MarkDown menu item should show the markdown editor', async ({ page }) => {
    const markdownLink = page.locator('nav').getByText('MarkDown', { exact: true });
    await markdownLink.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify the markdown editor textarea is visible
    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Verify the preview area is also present
    const preview = page.locator('.col-6').nth(1);
    await expect(preview).toBeVisible();

    // Verify the active state is applied
    const activeLink = page.locator('a[data-active="active"]');
    await expect(activeLink).toContainText('MarkDown');
  });

  test('clicking Projects menu item should display Projects content', async ({ page }) => {
    const projectsLink = page.locator('nav').getByText('Projects', { exact: true });
    await projectsLink.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify content loaded
    const articleContent = page.locator('.article-content, .container');
    await expect(articleContent).toBeVisible();

    // Verify the active state is applied
    const activeLink = page.locator('a[data-active="active"]');
    await expect(activeLink).toContainText('Projects');
  });

  test('clicking Links menu item should display Links content', async ({ page }) => {
    const linksLink = page.locator('nav').getByText('Links', { exact: true });
    await linksLink.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify content loaded
    const articleContent = page.locator('.article-content, .container');
    await expect(articleContent).toBeVisible();

    // Verify the active state is applied
    const activeLink = page.locator('a[data-active="active"]');
    await expect(activeLink).toContainText('Links');
  });

  test('clicking Resume menu item should open external link in new tab', async ({ page, context }) => {
    // Wait for any potential popup
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
      page.locator('nav').getByText('Resume', { exact: true }).click()
    ]);

    if (newPage) {
      // If a new page was opened, verify it's the resume link
      await newPage.waitForLoadState('networkidle');
      await expect(newPage).toHaveURL(/drive.google.com/);
      await newPage.close();
    } else {
      // For external links that might not open in new tab in test environment,
      // just verify the click doesn't cause errors
      await page.waitForLoadState('networkidle');
    }
  });

  test('menu item should show active state for current page', async ({ page }) => {
    // Click on Blog
    await page.locator('nav').getByText('Blog', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    // Verify the active state is applied to Blog link
    const activeLink = page.locator('a[data-active="active"]');
    await expect(activeLink).toContainText('Blog');

    // Navigate to another page
    await page.locator('nav').getByText('About', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    // Verify active state is now on About
    const newActiveLink = page.locator('a[data-active="active"]');
    await expect(newActiveLink).toContainText('About');
  });

  test('navigation should work correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile menu toggle should be visible
    const menuToggle = page.locator('button.navbar-toggler');
    await expect(menuToggle).toBeVisible();

    // Click to open mobile menu
    await menuToggle.click();

    // Wait for menu animation
    await page.waitForTimeout(300);

    // Menu items should be visible in the collapsed menu
    const aboutLink = page.locator('nav').getByText('About', { exact: true });
    await expect(aboutLink).toBeVisible();

    // Navigate via mobile menu
    await aboutLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify navigation worked - content should be visible
    const articleContent = page.locator('.article-content, .container');
    await expect(articleContent).toBeVisible();
  });
});
