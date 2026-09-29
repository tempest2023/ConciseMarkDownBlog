import { test, expect } from '@playwright/test';

test('changes pane arrangement and visibility without losing Markdown', async ({ page }) => {
  await page.goto('/?page=MarkDown');
  const source = page.getByRole('textbox', { name: 'Markdown source' });
  await expect(source).toBeVisible();
  await source.fill('# Layout keeps text');
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeVisible();

  const panes = page.locator('[data-layout]');
  const layoutButton = page.getByRole('button', { name: 'Layout' });
  await layoutButton.click();
  await page.getByRole('button', { name: 'Top and bottom' }).click();
  await expect(panes).toHaveAttribute('data-layout', 'top-and-bottom');
  const stacked = await panes.locator(':scope > div').evaluateAll(elements => elements.map(element => element.getBoundingClientRect()));
  expect(stacked[1].top).toBeGreaterThan(stacked[0].bottom);

  await page.getByRole('button', { name: 'Markdown editor' }).click();
  await expect(panes).toHaveAttribute('data-visible', 'preview');
  await expect(source).toBeHidden();
  await expect(page.getByRole('button', { name: 'Markdown preview' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeVisible();

  await page.getByRole('button', { name: 'Markdown editor' }).click();
  await expect(source).toHaveValue('# Layout keeps text');
  await page.getByRole('button', { name: 'Side by side' }).click();
  await expect(panes).toHaveAttribute('data-layout', 'side-by-side');
  await expect(panes).toHaveCSS('transition-property', 'grid-template-columns, column-gap');

  const initialWidth = await panes.locator(':scope > div').first().evaluate(element => element.getBoundingClientRect().width);
  await page.getByRole('button', { name: 'Markdown preview' }).click();
  await expect(panes).toHaveAttribute('data-visible', 'editor');
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeHidden();
  await expect.poll(() => panes.locator(':scope > div').first().evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(initialWidth * 1.7);
  await expect(panes.locator(':scope > div').last()).toHaveCSS('height', '0px');
  await expect(source).toHaveValue('# Layout keeps text');

  await page.getByRole('button', { name: 'Markdown preview' }).click();
  await page.getByRole('button', { name: 'Markdown editor' }).click();
  await expect(panes).toHaveAttribute('data-visible', 'preview');
  await expect(source).toBeHidden();
  await expect(panes.locator(':scope > div').first()).toHaveCSS('height', '0px');
  await expect.poll(() => panes.locator(':scope > div').last().evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(initialWidth * 1.7);
  await expect(page.getByRole('heading', { name: 'Layout keeps text' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(layoutButton).toBeFocused();
  await expect(layoutButton).toHaveAttribute('aria-expanded', 'false');
});
