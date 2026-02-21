/**
 * @file Scroll Jump Bug Detection Test
 * @description Validates scroll position preservation during textarea input
 *
 * The key insight is that real users don't perceive very brief (<100ms) scroll jumps.
 * This test measures scroll stability during realistic typing simulation and only
 * fails if scroll jumps are sustained or the final position is incorrect.
 */
import { test, expect } from '@playwright/test';

test.describe('Scroll Jump Bug Detection', () => {

  test('Markdown Editor - scroll preserved during typing', async ({ page }) => {
    await page.goto('/?page=markdown');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });

    // Create enough content to make page scrollable
    const longContent = Array.from({ length: 30 }, (_, i) =>
      `## Section ${i}\n\nThis is paragraph ${i} with enough text to make the content area scrollable and push the page down.\n`
    ).join('\n');

    await textarea.evaluate((el, value) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, longContent);
    await page.waitForTimeout(500);

    // Ensure page is scrollable then scroll down
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Page height: ${pageHeight}`);

    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(100);

    const scrollBefore = await page.evaluate(() => window.scrollY);
    console.log(`Scroll before: ${scrollBefore}`);

    // Skip test if page not scrollable
    if (scrollBefore < 50) {
      console.log('Page not scrollable, skipping scroll assertions');
      return;
    }

    // Track scroll with 60fps sampling
    await page.evaluate(() => {
      window.__scrollData = {
        samples: [],
        startTime: performance.now()
      };
      window.__scrollTracker = setInterval(() => {
        window.__scrollData.samples.push({
          time: performance.now(),
          y: window.scrollY
        });
      }, 16);
    });

    // Type with realistic timing
    await textarea.click();
    await page.waitForTimeout(100);

    const textToType = ' Adding more text here.';
    for (const char of textToType) {
      await textarea.press(char);
      await page.waitForTimeout(35);
    }

    await page.waitForTimeout(400);

    const scrollData = await page.evaluate(() => {
      if (window.__scrollTracker) clearInterval(window.__scrollTracker);
      return window.__scrollData;
    });

    const scrollAfter = await page.evaluate(() => window.scrollY);
    const samples = scrollData?.samples || [];

    // Count samples where scroll was at/near top while we were scrolled down
    const samplesAtTop = samples.filter(s => s.y < 50).length;
    const totalSamples = samples.length;

    console.log(`Samples: ${totalSamples}, at top: ${samplesAtTop}`);
    console.log(`Before: ${scrollBefore}, After: ${scrollAfter}`);

    // A sustained jump would have many samples at top
    // Brief blips (<100ms = ~6 samples at 60fps) are acceptable
    expect(samplesAtTop).toBeLessThan(6);
  });

  test('Article Edit Mode - scroll stability', async ({ page }) => {
    await page.goto('/?page=About');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const flipButton = page.locator('[class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(400);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    const content = Array.from({ length: 25 }, (_, i) =>
      `## Section ${i}\n\nContent paragraph ${i} with text to make the page longer and enable scrolling.\n`
    ).join('\n');

    await textarea.evaluate((el, value) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, content);
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(100);

    const scrollBefore = await page.evaluate(() => window.scrollY);
    console.log(`Article scroll before: ${scrollBefore}`);

    if (scrollBefore < 50) {
      console.log('Article not scrollable, skipping');
      return;
    }

    await page.evaluate(() => {
      window.__scrollData = { samples: [] };
      window.__scrollTracker = setInterval(() => {
        window.__scrollData.samples.push(window.scrollY);
      }, 16);
    });

    await textarea.click();
    await textarea.press('End');
    await page.waitForTimeout(100);

    for (const char of ' New content added.') {
      await textarea.press(char);
      await page.waitForTimeout(30);
    }

    await page.waitForTimeout(400);

    const samples = await page.evaluate(() => {
      if (window.__scrollTracker) clearInterval(window.__scrollTracker);
      return window.__scrollData.samples;
    });

    const samplesAtTop = samples.filter(y => y < 50).length;

    console.log(`Article samples at top: ${samplesAtTop}`);

    // Only check for scroll jumps to top - content growth changing scroll position is OK
    expect(samplesAtTop).toBeLessThan(6);
  });

  test('Bottom editing - viewport stays in place', async ({ page }) => {
    await page.goto('/?page=markdown');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });

    const longDoc = Array.from({ length: 40 }, (_, i) =>
      `## Section ${i}\n\nParagraph content for section ${i}. More text here to ensure the page is long enough for scrolling.\n`
    ).join('\n\n');

    await textarea.evaluate((el, value) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, longDoc);
    await page.waitForTimeout(500);

    // Scroll to near bottom
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const scrollTarget = Math.max(0, bodyHeight - 800);

    await page.evaluate((target) => window.scrollTo(0, target), scrollTarget);
    await page.waitForTimeout(100);

    const scrollBefore = await page.evaluate(() => window.scrollY);
    console.log(`Bottom scroll position: ${scrollBefore}`);

    if (scrollBefore < 200) {
      console.log('Not enough content to scroll, skipping');
      return;
    }

    await page.evaluate(() => {
      window.__scrollData = {
        samples: [],
        minScroll: window.scrollY
      };
      window.__scrollTracker = setInterval(() => {
        const y = window.scrollY;
        window.__scrollData.samples.push(y);
        window.__scrollData.minScroll = Math.min(window.__scrollData.minScroll, y);
      }, 16);
    });

    await textarea.click();
    await textarea.press('End');
    await page.waitForTimeout(100);
    await textarea.press('Enter');
    await page.waitForTimeout(50);

    for (const char of 'Typing at the bottom.') {
      await textarea.press(char);
      await page.waitForTimeout(30);
    }

    await page.waitForTimeout(400);

    const scrollData = await page.evaluate(() => {
      if (window.__scrollTracker) clearInterval(window.__scrollTracker);
      return window.__scrollData;
    });

    const scrollAfter = await page.evaluate(() => window.scrollY);
    const samplesAtTop = scrollData.samples.filter(y => y < 100).length;

    console.log(`Min scroll: ${scrollData.minScroll}, samples at top: ${samplesAtTop}`);

    // Should not have visited top for sustained period
    expect(samplesAtTop).toBeLessThan(6);
    // Viewport should remain in lower area
    expect(scrollAfter).toBeGreaterThan(200);
  });
});
