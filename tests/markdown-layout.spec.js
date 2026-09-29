import { test, expect } from '@playwright/test';

test('changes pane arrangement and visibility without losing Markdown', async ({ page }) => {
  await page.goto('/?page=MarkDown');
  const source = page.getByRole('textbox', { name: 'Markdown source' });
  await expect(source).toBeVisible();
  await source.fill('# Layout keeps text');
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeVisible();

  const panes = page.locator('[data-layout]');
  const layoutButton = page.getByRole('button', { name: /^Layout:/ });
  const visibilityButton = page.getByRole('button', { name: /^Visible panes:/ });
  await expect(layoutButton).toHaveAttribute('aria-label', 'Layout: Side by side. Switch to top and bottom');
  await expect(visibilityButton).toHaveAttribute('aria-label', 'Visible panes: editor and preview. Show preview only');

  await layoutButton.click();
  await expect(panes).toHaveAttribute('data-layout', 'top-and-bottom');
  await expect(layoutButton).toHaveAttribute('aria-label', 'Layout: Top and bottom. Switch to side by side');
  const stacked = await panes.locator(':scope > div').evaluateAll(elements => elements.map(element => element.getBoundingClientRect()));
  expect(stacked[1].top).toBeGreaterThan(stacked[0].bottom);

  await visibilityButton.click();
  await expect(panes).toHaveAttribute('data-visible', 'preview');
  await expect(source).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeVisible();
  await expect(visibilityButton).toHaveAttribute('aria-label', 'Visible panes: preview only. Show editor only');

  await visibilityButton.click();
  await expect(panes).toHaveAttribute('data-visible', 'editor');
  await expect(source).toHaveValue('# Layout keeps text');
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeHidden();

  await visibilityButton.click();
  await expect(panes).toHaveAttribute('data-visible', 'both');
  await layoutButton.click();
  await expect(panes).toHaveAttribute('data-layout', 'side-by-side');
  await expect(panes).toHaveCSS('transition-property', 'grid-template-columns, column-gap');

  const initialWidth = await panes.locator(':scope > div').first().evaluate(element => element.getBoundingClientRect().width);
  await visibilityButton.click();
  await expect(panes).toHaveAttribute('data-visible', 'preview');
  await expect(source).toBeHidden();
  await expect(panes.locator(':scope > div').first()).toHaveCSS('height', '0px');
  await expect.poll(() => panes.locator(':scope > div').last().evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(initialWidth * 1.7);

  await visibilityButton.click();
  await expect(panes).toHaveAttribute('data-visible', 'editor');
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeHidden();
  await expect.poll(() => panes.locator(':scope > div').first().evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(initialWidth * 1.7);
  await expect(panes.locator(':scope > div').last()).toHaveCSS('height', '0px');
  await expect(source).toHaveValue('# Layout keeps text');

  await visibilityButton.focus();
  await page.keyboard.press('Enter');
  await expect(panes).toHaveAttribute('data-visible', 'both');
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeVisible();
});
