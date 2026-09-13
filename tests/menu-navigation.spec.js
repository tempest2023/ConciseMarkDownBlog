/**
 * @file Menu Navigation Test
 * @description Verifies the current editorial header and responsive navigation.
 */
import { test, expect } from '@playwright/test';

// Hold the app bundle to measure the real HTML first paint, then release it.
// This catches layout shifts hidden by tests that only wait for networkidle.
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`keeps article geometry stable as JavaScript starts (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const geometry = () => page.locator('.article-content').evaluate(element => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width };
    });
    for (const url of ['/work/', '/writing/', '/links/']) {
      let release;
      const bundleReady = new Promise(resolve => { release = resolve; });
      await page.route('**/static/js/**', async route => {
        await bundleReady;
        await route.continue();
      });
      await page.goto(url, { waitUntil: 'commit' });
      await expect(page.locator('.article-content')).toBeVisible();
      await expect(page.locator('.notebook-sidebar')).toBeVisible();
      const before = await geometry();
      release();
      await expect(page.getByRole('button', { name: 'Open Ask Tempest' })).toBeVisible();
      const after = await geometry();
      for (const key of ['x', 'y', 'width']) expect(Math.abs(after[key] - before[key]), `${url}: ${key}`).toBeLessThanOrEqual(1);
      await expect(page.locator('.article-view-preview')).toHaveCSS('animation-name', 'none');
      await page.unroute('**/static/js/**');
    }
  });
}

test.describe('Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('shows the focused personal-blog navigation', async ({ page }) => {
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('.site-brand')).toHaveText("Tempest's blog");

    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('link')).toHaveCount(6);
    for (const name of ['About', 'Work & Research', 'Writing', 'Projects', 'Links']) {
      await expect(navigation.getByRole('link', { name, exact: true })).toBeVisible();
    }
    const portfolio = navigation.getByRole('link', { name: '3D Portfolio' });
    await expect(portfolio).toHaveAttribute('href', 'https://3d.tempest.fun/');
    await expect(portfolio.locator('svg')).toBeVisible();

    await expect(navigation.getByRole('link', { name: 'Ask Tempest' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open Ask Tempest' })).toBeVisible();

    const sidebarWidth = await page.locator('.notebook-sidebar').evaluate(element => element.getBoundingClientRect().width);
    expect(sidebarWidth).toBeLessThanOrEqual(230);
  });

  test('navigates between About, Writing, Work and Projects', async ({ page }) => {
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(navigation.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('aria-current', 'page');

    await navigation.getByRole('link', { name: 'Writing', exact: true }).click();
    await expect(page).toHaveURL(/\/writing\/$/);
    await expect(page.getByRole('heading', { name: 'Writing', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Writing', exact: true })).toHaveAttribute('aria-current', 'page');

    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work & Research', exact: true }).click();
    await expect(page).toHaveURL(/\/work\/$/);
    await expect(page.getByRole('heading', { name: 'Work & Research', exact: true })).toBeVisible();

    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Projects', exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(page.locator('.article-content')).toBeVisible();

    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Links', exact: true }).click();
    await expect(page).toHaveURL(/\/links\/$/);
    await expect(page.getByRole('heading', { name: 'Links', exact: true })).toBeVisible();
  });

  test('keeps RSS and Made of Markdown together below the notebook colophon', async ({ page }) => {
    const footerNavigation = page.getByRole('navigation', { name: 'More links' });
    await expect(footerNavigation.getByRole('link')).toHaveCount(2);
    await expect(footerNavigation.getByRole('link', { name: 'RSS' })).toHaveAttribute('href', '/rss.xml');
    await expect(page.locator('footer')).toContainText('A small space');
    await expect(footerNavigation.getByRole('link', { name: /Made of Markdown/ })).toHaveAttribute('href', 'https://github.com/tempest2023/ConciseMarkDownBlog');
    await expect(page.locator('.notebook-sidebar .notebook-colophon')).toHaveCount(0);
  });

  test('opens the compact navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const menuToggle = page.getByRole('button', { name: 'Menu' });
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');

    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(navigation.getByRole('link', { name: 'Writing', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Links', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: '3D Portfolio' })).toBeVisible();
    await navigation.getByRole('link', { name: 'Writing', exact: true }).click();
    await expect(page).toHaveURL(/\/writing\/$/);
    await expect(page.locator('.article-content')).toBeVisible();
  });
});
