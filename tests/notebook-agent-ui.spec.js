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
    await expect(page.locator('.markdown-note')).toHaveCSS('text-align', 'left');
  });

  test('uses the padded right section width and floats the Markdown switch', async ({ page }) => {
    const layout = await page.evaluate(() => {
      const main = document.querySelector('.main-container');
      const article = document.querySelector('.article-content');
      const shell = document.querySelector('.article-shell');
      const tools = document.querySelector('.article-tools');
      const mainStyle = getComputedStyle(main);
      const articleRect = article.getBoundingClientRect();
      const shellRect = shell.getBoundingClientRect();
      const toolsRect = tools.getBoundingClientRect();
      return {
        availableWidth: main.clientWidth - parseFloat(mainStyle.paddingLeft) - parseFloat(mainStyle.paddingRight),
        articleWidth: articleRect.width,
        toolsPosition: getComputedStyle(tools).position,
        rightGap: shellRect.right - toolsRect.right
      };
    });

    expect(layout.articleWidth).toBeCloseTo(layout.availableWidth, 0);
    expect(layout.toolsPosition).toBe('absolute');
    expect(Math.abs(layout.rightGap)).toBeLessThanOrEqual(1);
  });

  test('keeps the interactive agent outside article Markdown', async ({ page }) => {
    await expect(page.locator('.article-content [data-personal-agent]')).toHaveCount(0);
    await expect(page.locator('.companion-avatar')).toBeVisible();

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

  test('uses only a small multi-state PNG avatar for the companion', async ({ page }) => {
    const companion = page.locator('.companion-avatar');
    const size = await companion.evaluate(element => element.getBoundingClientRect().width);

    expect(size).toBeLessThanOrEqual(73.5);
    expect(size).toBeGreaterThanOrEqual(66.5);
    await expect(companion.locator('img')).toHaveCount(4);
    await expect(companion.locator('[data-avatar-state="idle"]')).toHaveAttribute('src', '/assets/agent-avatar/idle.png');
    await expect(companion.locator('[data-avatar-state="blink"]')).toHaveAttribute('src', '/assets/agent-avatar/blink.png');
    await expect(companion.locator('[data-avatar-state="curious"]')).toHaveAttribute('src', '/assets/agent-avatar/curious.png');
    await expect(companion.locator('[data-avatar-state="focused"]')).toHaveAttribute('src', '/assets/agent-avatar/focused.png');
    await expect(page.locator('.companion-bubble, .companion-chat-icon')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open Ask Tempest' }).locator('svg')).toHaveCount(0);
  });

  test('keeps the companion above the local settings button area', async ({ page }) => {
    const bottomGap = await page.locator('.agent-dock').evaluate(element => innerHeight - element.getBoundingClientRect().bottom);
    expect(bottomGap).toBeGreaterThanOrEqual(80);
  });
});
