/**
 * @file Scroll Jump Bug Detection Test
 * @description Detects the scroll jump bug where typing at bottom causes scroll to jump to top then back
 */
import { test, expect } from '@playwright/test';

test.describe('Scroll Jump Bug Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?page=About');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('Scroll jumps to top on every keystroke', async ({ page }) => {
    // Enter edit mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Create long content to make page scrollable
    const content = '# Test Document\n\n' +
      'This document has enough content to make the page scrollable.\n' +
      '- Item 1\n'.repeat(50) +
      '\n## Section 2\n\n' +
      'More content here.\n'.repeat(30);

    await textarea.fill(content);
    await page.waitForTimeout(500);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const startScroll = await page.evaluate(() => window.scrollY);
    console.log(`Start scroll position: ${startScroll}`);

    // Set up aggressive scroll tracking using polling (catches rapid jumps)
    await page.evaluate(() => {
      window.__scrollBug = {
        samples: [],
        jumpCount: 0,
        lastY: window.scrollY,
        highPoint: window.scrollY,
        lowPoint: window.scrollY,
        rapidDrops: []
      };

      // Poll at 60fps to catch rapid scroll changes
      const sampleInterval = setInterval(() => {
        const y = window.scrollY;
        const now = Date.now();
        const lastY = window.__scrollBug.lastY;
        const delta = y - lastY;

        window.__scrollBug.samples.push({ y, t: now, delta });

        // Track high/low points
        if (y > window.__scrollBug.highPoint) window.__scrollBug.highPoint = y;
        if (y < window.__scrollBug.lowPoint) window.__scrollBug.lowPoint = y;

        // Detect rapid upward jump (scroll up by more than 100px suddenly)
        // This is the bug pattern: scroll jumps up then back down
        if (delta < -100) {
          window.__scrollBug.rapidDrops.push({
            from: lastY,
            to: y,
            drop: -delta,
            time: now
          });
        }

        window.__scrollBug.lastY = y;
      }, 16); // ~60fps sampling

      // Stop sampling after 10 seconds
      setTimeout(() => clearInterval(sampleInterval), 10000);
      window.__sampleInterval = sampleInterval;
    });

    // Type multiple characters - the bug triggers on each keystroke
    await textarea.focus();
    await textarea.press('End');
    await page.waitForTimeout(100);

    // Type 15 characters - if bug exists, scroll will jump on each one
    for (let i = 0; i < 15; i++) {
      await textarea.press('x');
      await page.waitForTimeout(50); // Small delay between keystrokes
    }

    await page.waitForTimeout(500);

    // Stop the sampling
    await page.evaluate(() => {
      if (window.__sampleInterval) clearInterval(window.__sampleInterval);
    });

    const bugData = await page.evaluate(() => window.__scrollBug);
    const endScroll = await page.evaluate(() => window.scrollY);

    console.log(`\n=== BUG DETECTION RESULTS ===`);
    console.log(`Rapid drops detected: ${bugData.rapidDrops.length}`);
    console.log(`High point: ${bugData.highPoint}, Low point: ${bugData.lowPoint}`);
    console.log(`Samples collected: ${bugData.samples.length}`);
    console.log(`Start: ${startScroll}, End: ${endScroll}`);

    if (bugData.rapidDrops.length > 0) {
      console.log('Rapid drop details:', JSON.stringify(bugData.rapidDrops, null, 2));
    }

    // THE ACTUAL BUG DETECTION
    // Rapid upward jumps indicate the scroll bug
    expect(
      bugData.rapidDrops.length,
      `BUG DETECTED: ${bugData.rapidDrops.length} rapid scroll drops detected. ` +
      `Each drop >100px upward is the scroll jump bug. ` +
      `Drops: ${JSON.stringify(bugData.rapidDrops)}`
    ).toBe(0);
  });

  test('Scroll position oscillates rapidly', async ({ page }) => {
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Fill content
    await textarea.fill('# Test\n\n' + 'Line content.\n'.repeat(60));
    await page.waitForTimeout(500);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Track scroll variance - bug causes high variance
    await page.evaluate(() => {
      window.__varianceData = {
        positions: [],
        rapidChanges: 0
      };

      let lastY = window.scrollY;
      let lastChangeTime = Date.now();

      window.__varianceInterval = setInterval(() => {
        const y = window.scrollY;
        const now = Date.now();
        const delta = Math.abs(y - lastY);

        // If position changed significantly in short time
        if (delta > 50 && now - lastChangeTime < 100) {
          window.__varianceData.rapidChanges++;
        }

        window.__varianceData.positions.push({
          y,
          delta,
          time: now
        });

        lastY = y;
        if (delta > 0) lastChangeTime = now;
      }, 16);

      setTimeout(() => clearInterval(window.__varianceInterval), 10000);
    });

    // Type at bottom
    await textarea.focus();
    await textarea.press('End');

    for (let i = 0; i < 20; i++) {
      await textarea.press('a');
      await page.waitForTimeout(40);
    }

    await page.waitForTimeout(500);

    await page.evaluate(() => {
      if (window.__varianceInterval) clearInterval(window.__varianceInterval);
    });

    const data = await page.evaluate(() => window.__varianceData);

    console.log(`\n=== VARIANCE DETECTION ===`);
    console.log(`Rapid changes detected: ${data.rapidChanges}`);
    console.log(`Total samples: ${data.positions.length}`);

    // High number of rapid changes indicates the bug
    expect(
      data.rapidChanges,
      `BUG DETECTED: ${data.rapidChanges} rapid scroll changes detected. ` +
      `Stable scrolling should have minimal rapid changes.`
    ).toBeLessThanOrEqual(3); // Allow up to 3 for normal adjustments
  });
});
