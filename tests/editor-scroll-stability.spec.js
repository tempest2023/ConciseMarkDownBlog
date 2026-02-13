/**
 * @file Editor Scroll Stability Test
 * @description Verifies that the text editor does not cause page scroll jumps during interaction
 */
import { test, expect } from '@playwright/test';

test.describe('Editor Scroll Stability', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the markdown editor page
    await page.goto('/?page=MarkDown');
    await page.waitForLoadState('networkidle');

    // Wait for the textarea to be visible
    const textarea = page.locator('#fancy-markdown-textarea');
    await expect(textarea).toBeVisible();
  });

  test('typing should maintain cursor visibility without erratic viewport jumps', async ({ page }) => {
    const textarea = page.locator('#fancy-markdown-textarea');

    // Add content to make the editor area substantial
    const testContent = '# Scroll Stability Test\n\n' +
      'This is a test to verify that typing in the textarea maintains a good user experience.\n\n' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n'.repeat(20);

    await textarea.fill(testContent);
    await page.waitForTimeout(500);

    // Scroll to position the textarea in view
    await textarea.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);

    // Get the textarea position before typing
    const textareaBefore = await textarea.boundingBox();
    expect(textareaBefore).not.toBeNull();

    // Focus and type at the end of the textarea
    await textarea.focus();
    await textarea.press('End');

    // Type text at the end - expanding textarea should not cause jarring experience
    const typingText = '\n\nAdditional content being typed here.';
    for (const char of typingText) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    // Wait for any layout adjustments
    await page.waitForTimeout(300);

    // Get the textarea position after typing
    const textareaAfter = await textarea.boundingBox();
    expect(textareaAfter).not.toBeNull();

    // The textarea should still be visible (not scrolled completely out of view)
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    // Textarea should be at least partially visible (top within viewport or above, bottom within or below)
    expect(textareaAfter.y).toBeLessThan(viewportHeight);
    expect(textareaAfter.y + textareaAfter.height).toBeGreaterThan(0);

    // Verify the cursor position is at the end of the content
    const cursorPosition = await textarea.evaluate((el) => /** @type {HTMLTextAreaElement} */ (el).selectionStart);
    const textLength = await textarea.evaluate((el) => /** @type {HTMLTextAreaElement} */ (el).value.length);

    // Cursor should be near the end (allowing for small discrepancies)
    expect(cursorPosition).toBeGreaterThanOrEqual(textLength - typingText.length);
  });

  test('focusing textarea at bottom of long content should not scroll page away', async ({ page }) => {
    const textarea = page.locator('#fancy-markdown-textarea');

    // Add substantial content to make the page scrollable
    const longContent = '# Test Document\n\n' +
      'This document has enough content to make the page scrollable.\n\n' +
      '- Item 1\n'.repeat(50) +
      '\n## Section 2\n\n' +
      'More content here.\n\n' +
      'Line content.\n'.repeat(50);

    await textarea.fill(longContent);
    await page.waitForTimeout(500);

    // Get the document height
    const documentHeight = await page.evaluate(() => document.body.scrollHeight);
    const windowHeight = await page.evaluate(() => window.innerHeight);

    // Calculate a position near the bottom (but not at the very edge)
    const targetScroll = Math.max(0, documentHeight - windowHeight - 100);

    // Scroll to near bottom
    await page.evaluate((scrollY) => {
      window.scrollTo(0, scrollY);
    }, targetScroll);

    // Wait for scroll to settle
    await page.waitForTimeout(100);

    // Verify scroll position (allow for some tolerance in scroll position)
    const scrollBeforeFocus = await page.evaluate(() => window.scrollY);
    expect(scrollBeforeFocus).toBeGreaterThanOrEqual(Math.max(0, targetScroll - 50));

    // Track any scroll events during focus
    await page.evaluate(() => {
      window.__focusScrollDelta = 0;
      window.__scrollBeforeFocus = window.scrollY;
      window.addEventListener('scroll', () => {
        window.__focusScrollDelta = Math.abs(window.scrollY - window.__scrollBeforeFocus);
      });
    });

    // Click/focus at the end of the textarea
    await textarea.click();

    // Wait for any focus-induced scroll behavior
    await page.waitForTimeout(500);

    // Get the scroll delta caused by focus
    const focusScrollDelta = await page.evaluate(() => window.__focusScrollDelta);

    // Get final scroll position
    const scrollAfterFocus = await page.evaluate(() => window.scrollY);

    // The focus should not cause a large scroll jump
    // Some small adjustment (< 50px) might happen due to caret positioning
    expect(
      focusScrollDelta,
      `Focus caused a scroll jump of ${focusScrollDelta}px (from ${scrollBeforeFocus} to ${scrollAfterFocus})`
    ).toBeLessThanOrEqual(50);
  });

  test('typing at the end of long document should maintain viewport stability', async ({ page }) => {
    const textarea = page.locator('#fancy-markdown-textarea');

    // Fill with content and scroll to end
    const initialContent = '# Long Document\n\n' +
      'Introduction paragraph.\n\n' +
      '| Table | Column |\n'.repeat(10) +
      '\n' +
      '```javascript\n'.repeat(5) +
      'const x = 1;\n'.repeat(10) +
      '```\n'.repeat(5) +
      '\n## Conclusion\n\n' +
      'Final thoughts here.\n';

    await textarea.fill(initialContent);
    await page.waitForTimeout(500);

    // Scroll to view the bottom of the textarea
    await textarea.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // Scroll page to show the textarea
    await page.evaluate(() => {
      const textarea = document.querySelector('#fancy-markdown-textarea');
      if (textarea) {
        const rect = textarea.getBoundingClientRect();
        const scrollY = window.scrollY + rect.bottom - window.innerHeight + 100;
        window.scrollTo(0, Math.max(0, scrollY));
      }
    });

    // Get stable scroll position after initial adjustments
    await page.waitForTimeout(300);
    const stableScrollY = await page.evaluate(() => window.scrollY);

    // Type more content at the end
    await textarea.focus();
    await textarea.press('End');

    const additionalText = '\n\nMore content added at the end.';
    for (const char of additionalText) {
      await textarea.press(char);
      await page.waitForTimeout(5);
    }

    // Wait for layout to settle
    await page.waitForTimeout(300);

    // Get final scroll position
    const finalScrollY = await page.evaluate(() => window.scrollY);

    // Calculate the difference
    const scrollDiff = Math.abs(finalScrollY - stableScrollY);

    // The viewport should remain relatively stable
    // Allow for larger tolerance since adding content can expand the page
    expect(
      scrollDiff,
      `Viewport shifted by ${scrollDiff}px during typing (from ${stableScrollY} to ${finalScrollY})`
    ).toBeLessThanOrEqual(200);
  });
});
