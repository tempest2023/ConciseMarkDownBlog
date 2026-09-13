import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1512, height: 982 }, { width: 390, height: 844 }]) {
  test(`conversation sidebar manages and restores chats at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.route('**/api/chat', async route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: { available: true, model: 'inception/mercury-2.5', fallbackModels: ['alibaba/qwen3.8-flash'] } });
      const question = route.request().postDataJSON().messages.at(-1).content;
      return route.fulfill({ contentType: 'text/event-stream', body: [{ type: 'delta', text: `Saber answers: ${question}` }, { type: 'model', model: 'alibaba/qwen3.8-flash' }, { type: 'done' }].map(event => `data: ${JSON.stringify(event)}\n\n`).join('') });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Ask Tempest' }).click();
    await expect(page.getByRole('complementary', { name: 'Conversation history' })).toHaveCount(0);
    const send = async question => {
      await page.getByRole('textbox', { name: 'Your question' }).fill(question);
      await page.getByRole('button', { name: 'Send message' }).click();
      await expect(page.getByRole('log').getByText(`Saber answers: ${question}`, { exact: true })).toBeVisible();
    };
    const expand = async () => {
      await expect(page.getByRole('complementary', { name: 'Conversation history' })).toBeVisible();
      const button = page.getByRole('button', { name: 'Expand history' });
      if (await button.isVisible()) await button.click();
    };
    await send('What is Tempest researching?');
    await expect(page.getByRole('complementary', { name: 'Conversation history' })).toBeVisible();
    await expect(page.getByRole('button', { name: viewport.width < 768 ? 'Expand history' : 'Collapse history' })).toBeVisible();
    await page.getByRole('button', { name: 'New chat', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'What’s on your mind?' })).toBeVisible();
    await send('Tell me about Nova Agent');
    await expand();
    await page.getByRole('button', { name: 'Open conversation: What is Tempest researching?', exact: true }).click();
    await expect(page.getByRole('log').getByText('Saber answers: What is Tempest researching?', { exact: true })).toBeVisible();
    await expect(page.getByText('Model · alibaba/qwen3.8-flash · Fallback', { exact: true })).toBeVisible();
    await page.reload();
    await page.getByRole('button', { name: 'Open Ask Tempest' }).click();
    await expect(page.getByRole('log').getByText('Saber answers: What is Tempest researching?', { exact: true })).toBeVisible();
    await expand();
    await page.getByRole('button', { name: 'Delete conversation: What is Tempest researching?', exact: true }).click();
    await page.getByRole('button', { name: 'Delete chat', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Open conversation: What is Tempest researching?', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open conversation: Tell me about Nova Agent', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Collapse history' }).click();
    await expect(page.getByRole('log').getByText('Saber answers: Tell me about Nova Agent', { exact: true })).toBeVisible();
    const overflow = await page.getByRole('dialog').evaluate(element => element.scrollWidth > element.clientWidth);
    expect(overflow).toBe(false);
    await page.reload();
    await page.getByRole('button', { name: 'Open Ask Tempest' }).click();
    await expand();
    await expect(page.getByRole('button', { name: 'Open conversation: What is Tempest researching?', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open conversation: Tell me about Nova Agent', exact: true })).toBeVisible();
  });
}
