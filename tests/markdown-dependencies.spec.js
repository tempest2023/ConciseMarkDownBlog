import { test, expect } from '@playwright/test';

test('updated math and syntax dependencies render Markdown in the browser', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?page=MarkDown');
  const source = page.getByRole('textbox', { name: 'Markdown source' });
  await source.fill([
    '# Dependency compatibility',
    '',
    '$$\\frac{1}{2} + x^2$$',
    '',
    '```javascript',
    'const answer = 42;',
    '```',
  ].join('\n'));
  await expect(page.getByRole('heading', { name: 'Dependency compatibility' })).toBeVisible();
  await expect(page.locator('.katex-html')).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await expect(page.locator('code.language-javascript')).toContainText('const answer = 42;');
  await expect(page.locator('code.language-javascript span').first()).toBeVisible();
  expect(errors).toEqual([]);
});
