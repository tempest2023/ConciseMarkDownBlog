/**
 * @file Scroll Bug Detection Test
 * @description Detects the specific bug where typing at bottom causes scroll to jump up to top then back down
 */
import { test, expect } from '@playwright/test';

test.describe('Scroll Jump Bug Detection', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to About page
    await page.goto('/?page=About');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should NOT jump scroll to top on every keystroke when typing at bottom', async ({ page }) => {
    // Click flip button to enter raw edit mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Fill with substantial content first
    const baseContent = '# Bug Test\n\n' +
      'Testing scroll jump behavior.\n\n' +
      '- Item\n'.repeat(30) +
      '\nMore content here.\n'.repeat(15) +
      '\nFinal paragraph before the end of document.\n';

    await textarea.fill(baseContent);
    await page.waitForTimeout(300);

    // Scroll to bottom of page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(200);

    // Get scroll position before typing
    const scrollBeforeTyping = await page.evaluate(() => window.scrollY);
    console.log(`Initial scroll position: ${scrollBeforeTyping}`);

    // Set up scroll tracking that captures EVERY scroll event with detailed info
    await page.evaluate(() => {
      window.__scrollBugData = {
        scrollPositions: [],
        minScrollY: window.scrollY,
        maxScrollY: window.scrollY,
        jumpToTopCount: 0,
        erraticJumps: []
      };

      window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const timestamp = Date.now();

        window.__scrollBugData.scrollPositions.push({
          scrollY: currentY,
          timestamp: timestamp
        });

        // Track min/max
        if (currentY < window.__scrollBugData.minScrollY) {
          window.__scrollBugData.minScrollY = currentY;
        }
        if (currentY > window.__scrollBugData.maxScrollY) {
          window.__scrollBugData.maxScrollY = currentY;
        }

        // Detect jumps to top (scrollY near 0)
        if (currentY < 100 && window.__scrollBugData.scrollPositions.length > 1) {
          const prevY = window.__scrollBugData.scrollPositions[window.__scrollBugData.scrollPositions.length - 2].scrollY;
          if (prevY > 200) {
            window.__scrollBugData.jumpToTopCount++;
            window.__scrollBugData.erraticJumps.push({
              from: prevY,
              to: currentY,
              timestamp: timestamp
            });
          }
        }
      });
    });

    // Focus at end and type multi-line content
    await textarea.focus();
    await textarea.press('End');
    await page.waitForTimeout(100);

    // Type multi-line text - this should trigger the bug
    const lines = [
      '\nLine 1: First new line',
      '\nLine 2: Second new line',
      '\nLine 3: Third new line',
      '\nLine 4: Fourth new line',
      '\nLine 5: Fifth new line'
    ];

    for (const line of lines) {
      for (const char of line) {
        await textarea.press(char);
        await page.waitForTimeout(10);
      }
    }

    await page.waitForTimeout(500);

    // Get the data
    const scrollData = await page.evaluate(() => window.__scrollBugData);
    const scrollAfterTyping = await page.evaluate(() => window.scrollY);

    console.log('Scroll tracking data:', JSON.stringify(scrollData, null, 2));
    console.log(`Scroll before: ${scrollBeforeTyping}, after: ${scrollAfterTyping}`);
    console.log(`Jump to top count: ${scrollData.jumpToTopCount}`);
    console.log(`Min scroll: ${scrollData.minScrollY}, Max scroll: ${scrollData.maxScrollY}`);
    console.log(`Total scroll events: ${scrollData.scrollPositions.length}`);

    // THE BUG DETECTION:
    // If scroll jumps to top (near 0) and then back down multiple times during typing,
    // that's the bug we're looking for
    expect(
      scrollData.jumpToTopCount,
      `BUG DETECTED: Scroll jumped to top ${scrollData.jumpToTopCount} times during typing. ` +
      `This indicates the scroll position is being reset erratically. ` +
      `Erratic jumps: ${JSON.stringify(scrollData.erraticJumps)}`
    ).toBe(0);

    // Also verify we don't have an extreme range (going from near 0 to high values repeatedly)
    const scrollRange = scrollData.maxScrollY - scrollData.minScrollY;
    const expectedRange = scrollAfterTyping - scrollBeforeTyping + 500; // Allow some tolerance

    // If the range is way larger than expected, we had erratic jumps
    expect(
      scrollRange,
      `BUG DETECTED: Scroll range (${scrollRange}px) is much larger than expected ` +
      `(${expectedRange}px). This suggests scroll jumping behavior. ` +
      `Min: ${scrollData.minScrollY}, Max: ${scrollData.maxScrollY}`
    ).toBeLessThanOrEqual(Math.max(expectedRange, 1000));
  });

  test('scroll should remain stable or increase smoothly when adding lines at bottom', async ({ page }) => {
    // Click flip button
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Fill with content
    const content = '# Stability Test\n\n' +
      'Base content.\n'.repeat(40);

    await textarea.fill(content);
    await page.waitForTimeout(300);

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(200);

    const initialScroll = await page.evaluate(() => window.scrollY);

    // Track all scroll positions during typing
    await page.evaluate(() => {
      window.__stabilityData = {
        positions: [],
        suddenDrops: []
      };

      window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const lastY = window.__stabilityData.positions.length > 0
          ? window.__stabilityData.positions[window.__stabilityData.positions.length - 1].y
          : currentY;

        window.__stabilityData.positions.push({
          y: currentY,
          time: Date.now(),
          delta: currentY - lastY
        });

        // Detect sudden drops (scroll up by more than 200px)
        if (lastY - currentY > 200) {
          window.__stabilityData.suddenDrops.push({
            from: lastY,
            to: currentY,
            drop: lastY - currentY
          });
        }
      });
    });

    // Focus and type at end
    await textarea.focus();
    await textarea.press('End');

    // Type multiple lines
    const newLines = '\n\nLine 1\nLine 2\nLine 3\nLine 4\nLine 5\n';
    for (const char of newLines) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    await page.waitForTimeout(300);

    const stabilityData = await page.evaluate(() => window.__stabilityData);
    const finalScroll = await page.evaluate(() => window.scrollY);

    console.log(`Initial scroll: ${initialScroll}, Final scroll: ${finalScroll}`);
    console.log(`Sudden drops detected: ${stabilityData.suddenDrops.length}`);
    console.log('Drop details:', JSON.stringify(stabilityData.suddenDrops));

    // Expect NO sudden drops (scroll should not jump UP significantly)
    // When adding content at bottom, scroll should stay same or increase
    expect(
      stabilityData.suddenDrops.length,
      `BUG DETECTED: ${stabilityData.suddenDrops.length} sudden scroll drops detected ` +
      `while typing at bottom. Scroll should not jump upward. ` +
      `Details: ${JSON.stringify(stabilityData.suddenDrops)}`
    ).toBe(0);

    // Final scroll should be >= initial scroll (we added content)
    expect(
      finalScroll,
      `BUG: Final scroll (${finalScroll}) is less than initial (${initialScroll}). ` +
      `Scroll should increase or stay same when adding content at bottom.`
    ).toBeGreaterThanOrEqual(initialScroll - 50); // Small tolerance
  });

  test('cursor should remain in viewport without scroll jumping on each keystroke', async ({ page }) => {
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Create a long document
    await textarea.fill('# Long Doc\n\n' + 'Content line.\n'.repeat(50));
    await page.waitForTimeout(300);

    // Scroll to middle-bottom area
    await page.evaluate(() => {
      const docHeight = document.body.scrollHeight;
      window.scrollTo(0, docHeight * 0.7);
    });
    await page.waitForTimeout(200);

    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Track scroll behavior with focus on detecting oscillation
    await page.evaluate(() => {
      window.__oscillationData = {
        positions: [],
        oscillationCount: 0,
        topVisits: 0
      };

      let lastDirection = 0; // 0 = none, 1 = down, -1 = up

      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        window.__oscillationData.positions.push(y);

        // Count visits to top (within 50px of 0)
        if (y < 50) {
          window.__oscillationData.topVisits++;
        }

        // Detect direction changes
        if (window.__oscillationData.positions.length >= 2) {
          const prev = window.__oscillationData.positions[window.__oscillationData.positions.length - 2];
          const current = y;
          const direction = current > prev ? 1 : (current < prev ? -1 : 0);

          if (direction !== 0 && lastDirection !== 0 && direction !== lastDirection) {
            // If we changed direction and visited top, that's an oscillation
            if (y < 100 || prev < 100) {
              window.__oscillationData.oscillationCount++;
            }
          }

          if (direction !== 0) {
            lastDirection = direction;
          }
        }
      });
    });

    // Type content
    await textarea.focus();
    await textarea.press('End');

    const text = '\nNew line 1\nNew line 2\nNew line 3\n';
    for (const char of text) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    await page.waitForTimeout(300);

    const oscData = await page.evaluate(() => window.__oscillationData);

    console.log(`Scroll positions recorded: ${oscData.positions.length}`);
    console.log(`Top visits: ${oscData.topVisits}`);
    console.log(`Oscillations: ${oscData.oscillationCount}`);

    // The bug shows as multiple visits to the top during typing
    expect(
      oscData.topVisits,
      `BUG DETECTED: Scroll visited top of page ${oscData.topVisits} times during typing. ` +
      `This is the scroll jump bug - scroll should stay near cursor position.`
    ).toBeLessThanOrEqual(1); // Might visit once initially, but not repeatedly

    // Should not have oscillations (up-down-up-down pattern involving top)
    expect(
      oscData.oscillationCount,
      `BUG DETECTED: Detected ${oscData.oscillationCount} oscillations between top and cursor. ` +
      `Scroll should remain stable near cursor.`
    ).toBe(0);
  });
});
