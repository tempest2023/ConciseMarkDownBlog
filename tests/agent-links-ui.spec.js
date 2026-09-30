import { test, expect } from '@playwright/test';

const fineEdit = 'https://aclanthology.org/2025.findings-emnlp.118/';
const treeDiff = 'https://aclanthology.org/2026.surgellm-1.5/';
const article = '/blog/ai/my-ai-research-and-engineering-journey/';
const answer = `FineEdit: ${fineEdit}\n\nTreeDiff: ${treeDiff}\n\n[Read the article](${article})\n\nhttps://tempest.fun/work/#fineedit\n\n[Work reference](/?page=Work#fineedit)\n\nhttps://untrusted.example/track and [Unknown source](https://untrusted.example/track).`;

for (const viewport of [{ width: 1512, height: 982 }, { width: 390, height: 844 }]) {
  test(`agent source links open new tabs and preserve the conversation at ${viewport.width}px`, async ({ page, context }) => {
    await page.setViewportSize(viewport);
    await context.route(fineEdit, route => route.fulfill({ contentType: 'text/html', body: '<h1>FineEdit source fixture</h1>' }));
    await page.route('**/api/chat', route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: { available: true, model: 'test/model' } });
      return route.fulfill({ contentType: 'text/event-stream', body: [{ type: 'delta', text: answer }, { type: 'done' }].map(event => `data: ${JSON.stringify(event)}\n\n`).join('') });
    });
    await page.goto('/');
    const originalUrl = page.url();
    await page.getByRole('button', { name: 'Open Ask Tempest' }).click();
    await page.getByRole('textbox', { name: 'Your question' }).fill('Tell me more about FineEdit and TreeDiff.');
    await page.getByRole('button', { name: 'Send message' }).click();
    const reply = page.locator('.agent-message.assistant');
    const fineEditLink = reply.getByRole('link', { name: fineEdit, exact: true });
    await expect(fineEditLink).toHaveAttribute('href', fineEdit);
    await expect(reply.getByRole('link', { name: treeDiff, exact: true })).toHaveAttribute('href', treeDiff);
    await expect(reply.getByRole('link', { name: 'https://tempest.fun/work/#fineedit', exact: true })).toHaveAttribute('href', '/work/#fineedit');
    await expect(reply.getByRole('link', { name: 'Work reference', exact: true })).toHaveAttribute('href', '/work/#fineedit');
    await expect(reply.getByRole('link')).toHaveCount(5);
    await expect(reply.getByRole('link', { name: 'Unknown source' })).toHaveCount(0);
    await expect(reply.getByRole('link', { name: 'https://untrusted.example/track', exact: true })).toHaveCount(0);
    for (const link of await reply.getByRole('link').all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }

    const externalTabPromise = context.waitForEvent('page');
    await fineEditLink.click();
    const externalTab = await externalTabPromise;
    await expect(externalTab).toHaveURL(fineEdit);
    await expect(externalTab.getByRole('heading', { name: 'FineEdit source fixture' })).toBeVisible();
    await externalTab.close();

    const articleTabPromise = context.waitForEvent('page');
    await reply.getByRole('link', { name: 'Read the article', exact: true }).click();
    const articleTab = await articleTabPromise;
    await expect(articleTab).toHaveURL(new URL(article, originalUrl).href);
    await expect(articleTab.locator('.article-content')).toContainText('From Deep Learning to Production AI Agents');
    await articleTab.close();
    await expect(page).toHaveURL(originalUrl);
    await expect(page.getByRole('dialog', { name: 'Saber' })).toBeVisible();
    await expect(reply).toContainText('FineEdit:');

    await page.reload();
    await page.getByRole('button', { name: 'Open Ask Tempest' }).click();
    await expect(page.locator('.agent-message.assistant').getByRole('link')).toHaveCount(5);
  });
}
