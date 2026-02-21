/**
 * @file Scroll Jump Bug Detection Test
 * @description Detects scroll jump bug in real usage scenarios:
 * 1. Markdown Editor page (/?page=markdown)
 * 2. Article edit mode (flip button on article pages)
 */
import { test, expect } from '@playwright/test';

test.describe('Scroll Jump Bug Detection', () => {

  test('Markdown Editor: should not have scroll jumps when typing at bottom', async ({ page }) => {
    // Navigate directly to Markdown Editor page - real usage scenario
    await page.goto('/?page=markdown');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });

    // Wait for initial content to load
    await page.waitForTimeout(500);

    // Clear and create long content
    await textarea.fill('');
    await page.waitForTimeout(100);

    const longContent = '# Test Document\n\n' +
      'Introduction paragraph with some text.\n\n' +
      '- Item '.repeat(100) + '\n\n' +
      '## Section 2\n\n' +
      'More content here. '.repeat(50) + '\n\n' +
      '## Section 3\n\n' +
      'Even more content. '.repeat(50);

    await textarea.fill(longContent);
    await page.waitForTimeout(500);

    // Scroll to bottom - simulating real user behavior
    await page.evaluate(() => {
      const textarea = document.getElementById('fancy-markdown-textarea');
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(300);

    const startScroll = await page.evaluate(() => window.scrollY);
    console.log(`[Markdown Editor] Start scroll: ${startScroll}`);

    // Set up scroll tracking
    await page.evaluate(() => {
      window.__scrollData = {
        rapidDrops: [],
        lastY: window.scrollY,
        positions: []
      };

      const intervalId = setInterval(() => {
        const y = window.scrollY;
        const delta = y - window.__scrollData.lastY;

        window.__scrollData.positions.push({ y, delta, t: performance.now() });

        // Detect rapid upward jump (>100px)
        if (delta < -100) {
          window.__scrollData.rapidDrops.push({
            from: window.__scrollData.lastY,
            to: y,
            drop: -delta,
            t: performance.now()
          });
        }

        window.__scrollData.lastY = y;
      }, 16);

      window.__scrollInterval = intervalId;
      setTimeout(() => clearInterval(intervalId), 10000);
    });

    // Focus textarea and move cursor to end
    await textarea.focus();
    await textarea.press('End');
    await page.waitForTimeout(100);

    // Type at the bottom - real user behavior
    for (let i = 0; i < 15; i++) {
      await textarea.type('x', { delay: 10 });
    }

    await page.waitForTimeout(500);

    await page.evaluate(() => {
      if (window.__scrollInterval) clearInterval(window.__scrollInterval);
    });

    const data = await page.evaluate(() => window.__scrollData);
    const endScroll = await page.evaluate(() => window.scrollY);

    console.log(`[Markdown Editor] Rapid drops: ${data.rapidDrops.length}`);
    console.log(`[Markdown Editor] Start: ${startScroll}, End: ${endScroll}`);

    if (data.rapidDrops.length > 0) {
      console.log('Drops:', JSON.stringify(data.rapidDrops, null, 2));
    }

    expect(
      data.rapidDrops.length,
      `BUG: ${data.rapidDrops.length} rapid scroll drops detected in Markdown Editor. ` +
      `Drops: ${JSON.stringify(data.rapidDrops)}`
    ).toBe(0);
  });

  test('Article Edit Mode: should not have scroll jumps when typing at bottom', async ({ page }) => {
    // Navigate to an article page - real usage scenario
    await page.goto('/?page=About');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click flip button to enter edit mode - real user action
    const flipButton = page.locator('[class*="flip"], .flip-switch').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Create long content
    const longContent = '# About Me\n\n' +
      'This is a long about page. '.repeat(100) + '\n\n' +
      '## Experience\n\n' +
      '- Experience item '.repeat(50) + '\n\n' +
      '## Projects\n\n' +
      'Project description. '.repeat(50);

    await textarea.fill(longContent);
    await page.waitForTimeout(500);

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(300);

    const startScroll = await page.evaluate(() => window.scrollY);
    console.log(`[Article Edit] Start scroll: ${startScroll}`);

    // Set up scroll tracking
    await page.evaluate(() => {
      window.__scrollData = {
        rapidDrops: [],
        lastY: window.scrollY,
        positions: []
      };

      const intervalId = setInterval(() => {
        const y = window.scrollY;
        const delta = y - window.__scrollData.lastY;

        window.__scrollData.positions.push({ y, delta, t: performance.now() });

        if (delta < -100) {
          window.__scrollData.rapidDrops.push({
            from: window.__scrollData.lastY,
            to: y,
            drop: -delta,
            t: performance.now()
          });
        }

        window.__scrollData.lastY = y;
      }, 16);

      window.__scrollInterval = intervalId;
      setTimeout(() => clearInterval(intervalId), 10000);
    });

    // Focus and type at end
    await textarea.focus();
    await textarea.press('End');
    await page.waitForTimeout(100);

    // Type multiple lines
    for (let i = 0; i < 15; i++) {
      await textarea.type('x', { delay: 10 });
    }

    await page.waitForTimeout(500);

    await page.evaluate(() => {
      if (window.__scrollInterval) clearInterval(window.__scrollInterval);
    });

    const data = await page.evaluate(() => window.__scrollData);
    const endScroll = await page.evaluate(() => window.scrollY);

    console.log(`[Article Edit] Rapid drops: ${data.rapidDrops.length}`);
    console.log(`[Article Edit] Start: ${startScroll}, End: ${endScroll}`);

    if (data.rapidDrops.length > 0) {
      console.log('Drops:', JSON.stringify(data.rapidDrops, null, 2));
    }

    expect(
      data.rapidDrops.length,
      `BUG: ${data.rapidDrops.length} rapid scroll drops detected in Article Edit Mode. ` +
      `Drops: ${JSON.stringify(data.rapidDrops)}`
    ).toBe(0);
  });

  test('Rapid typing should not cause scroll oscillation', async ({ page }) => {
    // Test in Markdown Editor as it's the primary editing interface
    await page.goto('/?page=markdown');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });

    // Create scrollable content
    const content = '# Test\n\n' + 'Line content.\n'.repeat(80);
    await textarea.fill(content);
    await page.waitForTimeout(500);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Track rapid changes
    await page.evaluate(() => {
      window.__varianceData = {
        rapidChanges: 0,
        lastY: window.scrollY,
        lastChangeTime: Date.now()
      };

      const intervalId = setInterval(() => {
        const y = window.scrollY;
        const now = Date.now();
        const delta = Math.abs(y - window.__varianceData.lastY);

        if (delta > 50 && now - window.__varianceData.lastChangeTime < 100) {
          window.__varianceData.rapidChanges++;
        }

        window.__varianceData.lastY = y;
        if (delta > 0) window.__varianceData.lastChangeTime = now;
      }, 16);

      window.__varianceInterval = intervalId;
      setTimeout(() => clearInterval(intervalId), 10000);
    });

    // Rapid typing simulation
    await textarea.focus();
    await textarea.press('End');

    for (let i = 0; i < 20; i++) {
      await textarea.type('a', { delay: 5 });
    }

    await page.waitForTimeout(500);

    await page.evaluate(() => {
      if (window.__varianceInterval) clearInterval(window.__varianceInterval);
    });

    const data = await page.evaluate(() => window.__varianceData);
    console.log(`[Rapid Typing] Rapid changes: ${data.rapidChanges}`);

    expect(
      data.rapidChanges,
      `BUG: ${data.rapidChanges} rapid scroll changes detected during rapid typing.`
    ).toBeLessThanOrEqual(3);
  });
});
