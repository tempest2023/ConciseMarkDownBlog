import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1512, height: 982 }, { width: 390, height: 844 }]) {
  test(`conversation sidebar manages and restores chats at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.route('**/api/chat', async route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: { available: true, model: 'inception/mercury-2.5', fallbackModels: ['alibaba/qwen3.8-flash'] } });
      const question = route.request().postDataJSON().messages.at(-1).content;
      return route.fulfill({ contentType: 'text/event-stream', body: [{ type: 'delta', text: `Saber answers: ${question}` }, { type: 'model', model: 'alibaba/qwen3.8-flash' }, { type: 'done' }].map(event => `data: ${JSON.stringify(event)}\n\n`).join('') });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Ask Tempest' }).click();
    await expect(page.getByRole('complementary', { name: 'Conversation history' })).toHaveCount(0);
    const checkPrompts = async () => {
      const prompts = page.getByLabel('Suggested questions');
      await expect(prompts.getByRole('button')).toHaveCount(4);
      const layout = await prompts.evaluate(element => ({
        width: element.clientWidth,
        scrollWidth: element.scrollWidth,
        buttons: [...element.querySelectorAll('button')].map(button => {
          const rect = button.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: button.clientWidth, scrollWidth: button.scrollWidth };
        })
      }));
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width);
      expect(layout.buttons[0].y).toBe(layout.buttons[1].y);
      expect(layout.buttons[2].y).toBe(layout.buttons[3].y);
      expect(layout.buttons[2].y).toBeGreaterThan(layout.buttons[0].y);
      expect(layout.buttons[0].x).toBe(layout.buttons[2].x);
      for (const button of layout.buttons) expect(button.scrollWidth).toBeLessThanOrEqual(button.width);
    };
    await checkPrompts();
    await page.screenshot({ path: testInfo.outputPath('onboarding.png'), animations: 'disabled' });
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
    await expect(page.getByRole('heading', { name: 'What would you like to know?' })).toBeVisible();
    await checkPrompts();
    await page.screenshot({ path: testInfo.outputPath('new-chat.png'), animations: 'disabled' });
    await send('Tell me about Nova Agent');
    await expand();
    await page.getByRole('button', { name: 'Open conversation: What is Tempest researching?', exact: true }).click();
    await expect(page.getByRole('log').getByText('Saber answers: What is Tempest researching?', { exact: true })).toBeVisible();
    await expect(page.getByText('Model · alibaba/qwen3.8-flash', { exact: true })).toBeVisible();
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
