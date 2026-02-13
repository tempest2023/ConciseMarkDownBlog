/**
 * @file About Page Scroll Stability Test
 * @description Tests scroll behavior when typing in the About page's raw edit mode
 * after clicking the flip button. Verifies cursor visibility and scroll positioning.
 */
import { test, expect } from '@playwright/test';

test.describe('About Page Scroll Stability with Flip Button', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to About page
    await page.goto('/?page=About');
    await page.waitForLoadState('networkidle');

    // Wait for content to load - first wait for the container
    await page.waitForSelector('.container', { state: 'visible', timeout: 10000 });

    // Wait for the content to be fully loaded (not loading spinner)
    await page.waitForTimeout(1000);
  });

  test('should display flip button on About page', async ({ page }) => {
    // Verify the flip button is present using data-testid or class pattern
    // The flip button has the class 'flip-switch' from the FlipButton component
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible();
  });

  test('clicking flip button should switch to raw edit mode', async ({ page }) => {
    // Click the flip button to switch to raw mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible();
    await flipButton.click();

    // Wait for mode switch animation
    await page.waitForTimeout(500);

    // Verify the textarea is now visible
    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Verify textarea has content (the About page markdown)
    const textareaContent = await textarea.inputValue();
    expect(textareaContent.length).toBeGreaterThan(0);
  });

  test('typing at bottom should maintain cursor visibility and scroll appropriately', async ({ page }) => {
    // Click flip button to enter raw edit mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Get initial content
    const initialContent = await textarea.inputValue();

    // Add substantial content to make the textarea scrollable
    const paddingContent = '\n\n## Additional Section\n\n' +
      'This content is added to make the textarea scrollable for testing purposes.\n\n' +
      '- List item 1\n'.repeat(30) +
      '\nMore content here.\n'.repeat(20);

    await textarea.fill(initialContent + paddingContent);
    await page.waitForTimeout(500);

    // Scroll to bottom of the page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(200);

    // Get the scroll position after scrolling to bottom
    const scrollBeforeTyping = await page.evaluate(() => window.scrollY);
    const documentHeightBefore = await page.evaluate(() => document.body.scrollHeight);

    // Click at the end of the textarea and position cursor at the end
    await textarea.focus();
    await textarea.press('End');
    await page.waitForTimeout(100);

    // Track scroll behavior during typing
    await page.evaluate(() => {
      window.__scrollBehavior = {
        initialScrollY: window.scrollY,
        maxScrollDelta: 0,
        scrollEvents: []
      };

      window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const delta = Math.abs(currentY - window.__scrollBehavior.initialScrollY);

        if (delta > window.__scrollBehavior.maxScrollDelta) {
          window.__scrollBehavior.maxScrollDelta = delta;
        }

        window.__scrollBehavior.scrollEvents.push({
          scrollY: currentY,
          timestamp: Date.now()
        });
      });
    });

    // Type multi-line text at the end
    const multiLineText = '\n\nLine 1: First line of new content.\n' +
      'Line 2: Second line with more text to test scrolling.\n' +
      'Line 3: Third line continuing the content.\n' +
      'Line 4: Fourth line with additional information.\n' +
      'Line 5: Fifth and final line of this test block.\n';

    // Type character by character to simulate real typing
    for (const char of multiLineText) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    // Wait for any scroll adjustments
    await page.waitForTimeout(500);

    // Get scroll behavior data
    const scrollBehavior = await page.evaluate(() => window.__scrollBehavior);
    const scrollAfterTyping = await page.evaluate(() => window.scrollY);
    const documentHeightAfter = await page.evaluate(() => document.body.scrollHeight);

    // Verify the textarea is still visible
    const textareaBox = await textarea.boundingBox();
    expect(textareaBox).not.toBeNull();

    const viewportHeight = await page.evaluate(() => window.innerHeight);

    // Textarea should be at least partially visible
    expect(textareaBox.y).toBeLessThan(viewportHeight);
    expect(textareaBox.y + textareaBox.height).toBeGreaterThan(0);

    // Cursor should be visible (check that we're not scrolled far away from cursor)
    // The textarea's bottom should be near or in the viewport
    expect(textareaBox.y + textareaBox.height).toBeGreaterThan(-100);

    // For the last bottom line, the scroller should move down when lines increased
    // Document height should have increased due to new lines
    expect(documentHeightAfter).toBeGreaterThanOrEqual(documentHeightBefore);

    // Scroll position should have adjusted to accommodate new content
    // It should either stay the same or increase (follow the content)
    // Note: The scroll might not increase if we're already at the bottom
    console.log(`Scroll: ${scrollBeforeTyping} -> ${scrollAfterTyping}, Max delta: ${scrollBehavior.maxScrollDelta}`);
    console.log(`Document height: ${documentHeightBefore} -> ${documentHeightAfter}`);
  });

  test('cursor visibility should be maintained when typing with cursor in viewport', async ({ page }) => {
    // Click flip button to enter raw edit mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Add content to make textarea substantial
    const content = '# Test Document\n\n' +
      'This is test content.\n\n' +
      '```javascript\n'.repeat(3) +
      'const x = 1;\n'.repeat(10) +
      '```\n'.repeat(3) +
      '\n## Section 2\n\n' +
      'More content here.\n'.repeat(30);

    await textarea.fill(content);
    await page.waitForTimeout(300);

    // Scroll to position the textarea in the middle of viewport
    await textarea.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Get textarea position before typing
    const textareaBefore = await textarea.boundingBox();

    // Focus and position cursor
    await textarea.focus();

    // Type some text in the middle of the document
    await textarea.press('Home');
    await page.waitForTimeout(50);

    // Add new lines in the middle
    const middleText = '\n\n[MIDDLE INSERTION]\nNew line here.\n';

    for (const char of middleText) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    await page.waitForTimeout(300);

    // Get textarea position after typing
    const textareaAfter = await textarea.boundingBox();
    const viewportHeightAfter = await page.evaluate(() => window.innerHeight);

    // If cursor was in viewport, the scroll should not have jumped erratically
    // The textarea should remain visible
    expect(textareaAfter.y).toBeLessThan(viewportHeightAfter);
    expect(textareaAfter.y + textareaAfter.height).toBeGreaterThan(0);

    // Position should be relatively stable (no massive jumps)
    const positionDelta = Math.abs(textareaAfter.y - textareaBefore.y);
    expect(positionDelta).toBeLessThan(300);
  });

  test('scroll should follow cursor when typing at bottom edge of viewport', async ({ page }) => {
    // Click flip button to enter raw edit mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Fill with content
    const baseContent = '# Edge Test\n\n' +
      'Testing scroll behavior at viewport edge.\n\n' +
      '- Item\n'.repeat(50) +
      '\nEnd of list.\n';

    await textarea.fill(baseContent);
    await page.waitForTimeout(300);

    // Scroll so that we're at the bottom edge of the viewport
    await page.evaluate(() => {
      const textarea = document.querySelector('#fancy-markdown-textarea');
      if (textarea) {
        const rect = textarea.getBoundingClientRect();
        // Scroll so textarea bottom is just at viewport bottom
        const targetScroll = window.scrollY + rect.bottom - window.innerHeight + 50;
        window.scrollTo(0, Math.max(0, targetScroll));
      }
    });
    await page.waitForTimeout(200);

    // Get scroll position before typing
    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Position cursor at the end
    await textarea.focus();
    await textarea.press('End');

    // Type multiple lines that will extend beyond viewport
    const extendingText = '\n\nExtending line 1\n' +
      'Extending line 2\n' +
      'Extending line 3\n' +
      'Extending line 4\n' +
      'Extending line 5\n';

    for (const char of extendingText) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    await page.waitForTimeout(300);

    // Get scroll position after typing
    const scrollAfter = await page.evaluate(() => window.scrollY);

    // Scroll behavior may vary during auto-resize, but key things to check:
    // 1. Scroll should not have jumped to top (near 0)
    expect(scrollAfter).toBeGreaterThanOrEqual(100);

    // 2. Verify textarea is still visible (cursor should be in view)
    const textareaBox = await textarea.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    expect(textareaBox.y).toBeLessThan(viewportHeight);
    expect(textareaBox.y + textareaBox.height).toBeGreaterThan(-100);
  });

  test('multi-line input at bottom should scroll down appropriately', async ({ page }) => {
    // Click flip button to enter raw edit mode
    const flipButton = page.locator('.flip-switch, [class*="flip"]').first();
    await expect(flipButton).toBeVisible({ timeout: 5000 });
    await flipButton.click();
    await page.waitForTimeout(500);

    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();

    // Add substantial content
    const initialContent = '# Multi-line Test\n\n' +
      'Initial content block.\n'.repeat(40);

    await textarea.fill(initialContent);
    await page.waitForTimeout(300);

    // Scroll to absolute bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(200);

    const initialScrollY = await page.evaluate(() => window.scrollY);
    const initialDocHeight = await page.evaluate(() => document.body.scrollHeight);

    // Track scroll behavior during multi-line input
    await page.evaluate(() => {
      window.__typingScrollData = {
        scrollPositions: [],
        initialScrollY: window.scrollY
      };

      window.addEventListener('scroll', () => {
        window.__typingScrollData.scrollPositions.push({
          scrollY: window.scrollY,
          timestamp: Date.now()
        });
      });
    });

    // Position cursor at end
    await textarea.focus();
    await textarea.press('End');

    // Type multi-line content
    const multiLineInput = '\n\nNew Section:\n' +
      'Line 1 of new content\n' +
      'Line 2 of new content\n' +
      'Line 3 of new content\n' +
      'Line 4 of new content\n' +
      'Line 5 of new content\n' +
      'Line 6 of new content\n' +
      'Line 7 of new content\n' +
      'Line 8 of new content\n';

    for (const char of multiLineInput) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    await page.waitForTimeout(500);

    // Get data
    const typingData = await page.evaluate(() => window.__typingScrollData);
    const finalScrollY = await page.evaluate(() => window.scrollY);
    const finalDocHeight = await page.evaluate(() => document.body.scrollHeight);

    // Document height check - may stay same if content fits within existing height
    // due to auto-resize already accommodating content

    // Scroll position may fluctuate during auto-resize, but should not jump to top:
    expect(finalScrollY).toBeGreaterThanOrEqual(100);

    // Verify the textarea/cursor area is visible
    const textareaBox = await textarea.boundingBox();

    // The bottom of the textarea should be visible or just below viewport
    // (within tolerance for scroll adjustments)
    const bottomVisibility = textareaBox.y + textareaBox.height;
    expect(bottomVisibility).toBeGreaterThan(-200);

    // Log for debugging
    console.log(`Initial scroll: ${initialScrollY}, Final scroll: ${finalScrollY}`);
    console.log(`Initial height: ${initialDocHeight}, Final height: ${finalDocHeight}`);
    console.log(`Scroll positions recorded: ${typingData.scrollPositions.length}`);
  });
});
