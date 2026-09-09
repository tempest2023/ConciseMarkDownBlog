import { test, expect } from '@playwright/test';

test.describe('Notebook and agent companion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('keeps the animated Markdown icon switch', async ({ page }) => {
    const flip = page.getByRole('button', { name: 'Switch to Markdown' });
    await expect(flip).toBeVisible();
    await expect(flip.locator('.flip-face')).toHaveCount(2);
    await expect(flip.locator('.flip-bg')).toHaveCSS('animation-duration', '0.62s');

    await flip.click();
    await expect(page.getByRole('textbox', { name: 'Markdown source' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Read article' }).locator('.flip-bg')).toHaveCSS('animation-name', 'markdown-flip');
  });

  test('keeps the interactive agent outside article Markdown', async ({ page }) => {
    await expect(page.locator('.article-content [data-personal-agent]')).toHaveCount(0);
    await expect(page.locator('.companion-art')).toBeVisible();

    const launcher = page.getByRole('button', { name: 'Open Ask Tempest' });
    await expect(launcher).toHaveCSS('animation-duration', '5s');
    await launcher.click();

    const dialog = page.getByRole('dialog', { name: 'Ask Tempest' });
    await expect(dialog).toBeVisible();
    const size = await dialog.evaluate(element => {
      return { width: element.offsetWidth, height: element.offsetHeight, viewportWidth: innerWidth, viewportHeight: innerHeight };
    });
    expect(size.width).toBeCloseTo(size.viewportWidth * .8, 0);
    expect(size.height).toBeCloseTo(size.viewportHeight * .8, 0);
    await expect(dialog).toHaveCSS('backdrop-filter', 'blur(28px) saturate(1.18)');

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(launcher).toBeFocused();
  });
});
