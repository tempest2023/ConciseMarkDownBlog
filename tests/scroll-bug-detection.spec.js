/**
 * @file Scroll Jump Bug Detection Test
 * @description Detects the scroll jump bug where typing at bottom causes scroll to oscillate up/down
 */
import { test, expect } from '@playwright/test';

test.describe('Scroll Jump Bug Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?page=About');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should NOT oscillate scroll position when typing at bottom', async ({ page }) => {
    // Enter edit mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Create long content
    const content = '# Test\n\n' + 'Line content.\n'.repeat(50);
    await textarea.fill(content);
    await page.waitForTimeout(300);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);

    const startScroll = await page.evaluate(() => window.scrollY);
    console.log(`Start scroll: ${startScroll}`);

    // Set up enhanced scroll tracking
    await page.evaluate(() => {
      window.__scrollData = {
        positions: [],
        oscillations: [],
        lastPosition: window.scrollY,
        lastDirection: 0 // 0=none, 1=down, -1=up
      };

      window.addEventListener('scroll', () => {
        const pos = window.scrollY;
        const prevPos = window.__scrollData.lastPosition;
        const delta = pos - prevPos;

        // Determine direction
        let direction = 0;
        if (delta > 10) direction = 1; // scrolling down
        else if (delta < -10) direction = -1; // scrolling up

        // Detect oscillation: direction change with significant movement
        if (direction !== 0 && window.__scrollData.lastDirection !== 0) {
          if (direction !== window.__scrollData.lastDirection) {
            // Direction changed - this is an oscillation
            window.__scrollData.oscillations.push({
              from: prevPos,
              to: pos,
              direction: direction === 1 ? 'down' : 'up',
              timestamp: Date.now()
            });
          }
        }

        if (direction !== 0) {
          window.__scrollData.lastDirection = direction;
        }
        window.__scrollData.lastPosition = pos;
        window.__scrollData.positions.push({ y: pos, t: Date.now() });
      });
    });

    // Type at the bottom
    await textarea.focus();
    await textarea.press('End');

    for (let i = 0; i < 20; i++) {
      await textarea.press('a');
      await page.waitForTimeout(20);
    }

    await page.waitForTimeout(500);

    const data = await page.evaluate(() => window.__scrollData);
    const endScroll = await page.evaluate(() => window.scrollY);

    console.log(`Oscillations detected: ${data.oscillations.length}`);
    console.log(`Start: ${startScroll}, End: ${endScroll}`);

    if (data.oscillations.length > 0) {
      console.log('Oscillation details:', JSON.stringify(data.oscillations.slice(0, 5), null, 2));
    }

    // BUG: Multiple oscillations indicate scroll jumping up and down
    expect(
      data.oscillations.length,
      `BUG DETECTED: ${data.oscillations.length} scroll oscillations detected. ` +
      `Scroll should not jump up/down when typing at bottom.`
    ).toBeLessThanOrEqual(2); // Allow 1-2 for initial adjustment
  });

  test('should NOT visit top of page when typing at bottom', async ({ page }) => {
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Fill content
    await textarea.fill('# Test\n\n' + 'Content.\n'.repeat(60));
    await page.waitForTimeout(300);

    // Scroll to near bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 500));
    await page.waitForTimeout(200);

    const initialScroll = await page.evaluate(() => window.scrollY);
    console.log(`Initial scroll: ${initialScroll}`);

    // Track visits to top (within 200px of 0)
    await page.evaluate(() => {
      window.__topVisits = 0;
      window.__nearTopEvents = [];

      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < 200) {
          window.__topVisits++;
          window.__nearTopEvents.push({
            scrollY: y,
            time: Date.now()
          });
        }
      });
    });

    // Type multiple lines
    await textarea.focus();
    await textarea.press('End');

    const text = '\nNew line\nMore content\nEven more\n';
    for (const char of text) {
      await textarea.press(char);
      await page.waitForTimeout(15);
    }

    await page.waitForTimeout(400);

    const topVisits = await page.evaluate(() => window.__topVisits);
    const nearTopEvents = await page.evaluate(() => window.__nearTopEvents);

    console.log(`Top visits (<200px): ${topVisits}`);
    console.log('Near-top events:', JSON.stringify(nearTopEvents));

    // BUG: Visiting top of page while typing at bottom is the scroll jump bug
    expect(
      topVisits,
      `BUG DETECTED: Scroll visited top of page ${topVisits} times while typing at bottom. ` +
      `Near-top events: ${JSON.stringify(nearTopEvents)}`
    ).toBe(0);
  });

  test('scroll delta should be smooth without large jumps', async ({ page }) => {
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Create content
    await textarea.fill('# Test\n\n' + 'Line.\n'.repeat(45));
    await page.waitForTimeout(300);

    // Scroll to bottom area
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);

    // Track all scroll deltas
    await page.evaluate(() => {
      window.__deltas = [];
      window.__largeJumps = [];
      let lastY = window.scrollY;

      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const delta = Math.abs(y - lastY);
        lastY = y;

        window.__deltas.push(delta);

        // Large jump = more than 300px change between events
        if (delta > 300) {
          window.__largeJumps.push({ to: y, delta });
        }
      });
    });

    // Type content
    await textarea.focus();
    await textarea.press('End');

    for (let i = 0; i < 30; i++) {
      await textarea.type('x', { delay: 10 });
    }

    await page.waitForTimeout(500);

    const largeJumps = await page.evaluate(() => window.__largeJumps);
    const deltas = await page.evaluate(() => window.__deltas);

    console.log(`Total scroll events: ${deltas.length}`);
    console.log(`Large jumps (>300px): ${largeJumps.length}`);

    if (largeJumps.length > 0) {
      console.log('Large jump details:', JSON.stringify(largeJumps, null, 2));
    }

    // BUG: Large jumps indicate erratic scroll behavior
    expect(
      largeJumps.length,
      `BUG DETECTED: ${largeJumps.length} large scroll jumps (>300px) detected. ` +
      `Scroll should change smoothly. Large jumps: ${JSON.stringify(largeJumps)}`
    ).toBe(0);
  });
});
