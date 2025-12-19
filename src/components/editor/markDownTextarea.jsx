/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:01:07
 * @modify date 2022-08-31 13:01:07
 * @desc markdown input component
 */

import React, { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Textarea, { resize } from 'react-expanding-textarea';
import config from '../../config';
import styles from '../../styles/editor.module.css';

const markdownConfig = config.markdown;
export default function MarkdownTextarea ({
  maxLength,
  placeholder,
  deafultValue,
  updatePreview,
  showHeader
}) {
  const textareaRef = useRef();
  const shouldPreserveScrollRef = useRef(false);
  const savedScrollYRef = useRef(0);
  const cursorLineInfoRef = useRef(null);

  // Helper function to get cursor line position in viewport
  const getCursorLineViewportPosition = (textarea, cursorPosition) => {
    // Create a temporary element to measure text height up to cursor
    const tempDiv = document.createElement('div');
    const computedStyle = window.getComputedStyle(textarea);
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.style.wordWrap = 'break-word';
    tempDiv.style.font = computedStyle.font;
    tempDiv.style.width = textarea.offsetWidth + 'px';
    tempDiv.style.padding = computedStyle.padding;
    tempDiv.style.border = computedStyle.border;
    tempDiv.style.boxSizing = computedStyle.boxSizing;
    tempDiv.textContent = textarea.value.substring(0, cursorPosition);
    document.body.appendChild(tempDiv);
    const textHeight = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);

    // Get line height
    const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2;

    // Calculate cursor position relative to textarea top
    const cursorRelativeTop = textHeight;
    const cursorRelativeBottom = cursorRelativeTop + lineHeight;

    // Get textarea position in viewport
    const textareaRect = textarea.getBoundingClientRect();
    const textareaTop = textareaRect.top;
    const textareaBottom = textareaRect.bottom;

    // Calculate cursor position in viewport
    const cursorViewportTop = textareaTop + cursorRelativeTop;
    const cursorViewportBottom = textareaTop + cursorRelativeBottom;

    return {
      top: cursorViewportTop,
      bottom: cursorViewportBottom,
      lineHeight
    };
  };

  const handleChange = useCallback(e => {
    const textarea = textareaRef.current;
    if (!textarea) {
      updatePreview(e.target.value);
      return;
    }

    const cursorPosition = textarea.selectionStart;
    const currentScrollY = window.scrollY || 0;
    const windowHeight = window.innerHeight;

    // Get cursor line position in viewport
    const cursorLinePos = getCursorLineViewportPosition(textarea, cursorPosition);
    const lineHeight = cursorLinePos.lineHeight || 20;

    // Get textarea position in viewport
    const textareaRect = textarea.getBoundingClientRect();
    const textareaTop = textareaRect.top;
    const textareaBottom = textareaRect.bottom;

    // Calculate visible area of textarea (the part that's actually visible in viewport)
    const viewportTop = 0;
    const viewportBottom = windowHeight;
    const visibleTextareaTop = Math.max(viewportTop, textareaTop);
    const visibleTextareaBottom = Math.min(viewportBottom, textareaBottom);

    // Check if cursor line is within the visible portion of textarea
    // This is the key: we check if cursor is in the visible part of textarea, not the entire viewport
    // Account for padding/margin at bottom
    const bottomPadding = 20; // main-container padding
    const bottomMargin = 16; // textarea margin (1rem)
    const extraTolerance = 100; // Large tolerance for bottom area
    const effectiveVisibleBottom = Math.min(viewportBottom - bottomPadding - bottomMargin, visibleTextareaBottom) + extraTolerance;

    // Cursor line is visible if it's within the visible textarea area (with tolerance at bottom)
    const isCursorLineVisible = cursorLinePos.top >= visibleTextareaTop &&
                                cursorLinePos.top < effectiveVisibleBottom &&
                                cursorLinePos.bottom > visibleTextareaTop;

    // Also check if cursor is reasonably positioned (not too far outside viewport)
    // This prevents false positives when cursor is way below viewport
    const maxDistanceBelowViewport = lineHeight * 5; // Allow up to 5 line heights below viewport
    const isCursorInReasonableRange = cursorLinePos.top < (viewportBottom + maxDistanceBelowViewport);

    // Combine both checks: cursor should be in visible textarea area AND in reasonable range
    const isCursorInVisibleArea = isCursorLineVisible && isCursorInReasonableRange;

    // Debug logging
    if (config.debug) {
      console.log('[Scroll Debug] handleChange:', {
        cursorPosition,
        currentScrollY,
        windowHeight,
        cursorLineTop: cursorLinePos.top,
        cursorLineBottom: cursorLinePos.bottom,
        lineHeight,
        textareaTop,
        textareaBottom,
        visibleTextareaTop,
        visibleTextareaBottom,
        effectiveVisibleBottom,
        isCursorLineVisible,
        isCursorInReasonableRange,
        isCursorInVisibleArea,
        shouldPreserve: isCursorInVisibleArea
      });
    }

    // Save scroll position BEFORE calling updatePreview
    // This ensures we capture the scroll position before any re-render happens
    if (isCursorInVisibleArea) {
      // Cursor line is visible and in the visible area, preserve scroll position
      shouldPreserveScrollRef.current = true;
      savedScrollYRef.current = currentScrollY;
      cursorLineInfoRef.current = {
        cursorPosition,
        lineTop: cursorLinePos.top,
        lineBottom: cursorLinePos.bottom
      };
    } else {
      // Cursor line is not visible, let browser naturally scroll to it
      shouldPreserveScrollRef.current = false;
      cursorLineInfoRef.current = null;
    }

    // Update preview (this may trigger re-render)
    // The scroll position restoration will happen in useLayoutEffect
    updatePreview(e.target.value);

    // Immediately restore scroll if it was changed by updatePreview's synchronous effects
    // This is a safety measure in case updatePreview causes immediate re-render
    if (isCursorInVisibleArea && Math.abs(window.scrollY - currentScrollY) > 1) {
      window.scrollTo(0, currentScrollY);
    }
  }, [updatePreview]);

  // Restore scroll position after DOM update if needed
  useLayoutEffect(() => {
    if (shouldPreserveScrollRef.current && textareaRef.current && cursorLineInfoRef.current) {
      const savedScrollY = savedScrollYRef.current;
      const cursorInfo = cursorLineInfoRef.current;

      // Since we already checked in handleChange that cursor is visible,
      // we should restore scroll position directly without re-checking.
      // The re-check was causing issues because text expansion changes cursor position
      // but the user is still typing, so we should preserve scroll.
      const currentScrollY = window.scrollY || 0;

      // Debug logging
      if (config.debug) {
        const textarea = textareaRef.current;
        const newCursorLinePos = getCursorLineViewportPosition(textarea, cursorInfo.cursorPosition);
        console.log('[Scroll Debug] useLayoutEffect:', {
          cursorPosition: cursorInfo.cursorPosition,
          savedScrollY,
          currentScrollY,
          scrollDifference: Math.abs(currentScrollY - savedScrollY),
          originalLineTop: cursorInfo.lineTop,
          newCursorLineTop: newCursorLinePos.top,
          willRestore: Math.abs(currentScrollY - savedScrollY) > 1
        });
      }

      // Restore scroll position if it was changed (likely by React re-render or browser auto-scroll)
      // We restore directly because we already validated in handleChange
      if (Math.abs(currentScrollY - savedScrollY) > 1) {
        if (config.debug) {
          console.log('[Scroll Debug] Restoring scroll from', currentScrollY, 'to', savedScrollY);
        }
        // Restore synchronously in useLayoutEffect (before browser paint)
        window.scrollTo(0, savedScrollY);

        // Also restore after a microtask to handle any async browser operations
        // This ensures scroll is restored even if browser tries to reset it again
        Promise.resolve().then(() => {
          const latestScrollY = window.scrollY || 0;
          if (Math.abs(latestScrollY - savedScrollY) > 1) {
            window.scrollTo(0, savedScrollY);
          }
        });
      }

      shouldPreserveScrollRef.current = false;
      cursorLineInfoRef.current = null;
    }
  });

  useEffect(() => {
    // update textarea value when deafultValue changes
    textareaRef.current.value = deafultValue;
  }, [deafultValue]);

  const onKeyDown = e => {
    const textArea = textareaRef.current;
    if (e.key === 'Tab') {
      e.preventDefault();
      // move forward two spaces as a tab
      const { tabSize = 2 } = markdownConfig;
      const position = textArea.selectionStart + tabSize;
      const leftPart = textArea.value.substr(0, textArea.selectionStart);
      const rightPart = textArea.value.substr(textArea.selectionStart);
      let tabSpaces = '';
      for (let i = 0; i < tabSize; i++) {
        tabSpaces += ' ';
      }
      textArea.value = `${leftPart}${tabSpaces}${rightPart}`;
      textArea.selectionStart = position;
      textArea.selectionEnd = position;
      textArea.focus();
      // Trigger change event to handle scroll
      const event = new Event('input', { bubbles: true });
      textArea.dispatchEvent(event);
    }
  };

  useEffect(() => {
    resize(0, textareaRef.current);
  }, [deafultValue]);

  return (
    <div className={styles['markdown-editor-container']}>
      {showHeader && <h1>Markdown Editor</h1>}
      <Textarea
        className={styles['fancy-textarea']}
        onKeyDown={onKeyDown}
        defaultValue={deafultValue}
        id='fancy-markdown-textarea'
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder}
        ref={textareaRef}
        rows='25'
      />
    </div>
  );
}

MarkdownTextarea.propTypes = {
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  deafultValue: PropTypes.string.isRequired,
  updatePreview: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
};
