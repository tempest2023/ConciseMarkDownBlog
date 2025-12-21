/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:01:07
 * @modify date 2022-08-31 13:01:07
 * @desc markdown input component
 */

import React, { useEffect, useRef, useCallback } from 'react';
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
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY || 0 : 0);
  const scrollLogDebounceRef = useRef(null);

  // Helper function to check if cursor line is visible in viewport
  const isCursorLineVisible = (textarea, cursorPosition) => {
    if (!textarea) {
      return false;
    }

    // Get cursor position in textarea
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);

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
    tempDiv.textContent = textBeforeCursor;
    document.body.appendChild(tempDiv);
    const textHeight = tempDiv.offsetHeight;
    const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2;
    document.body.removeChild(tempDiv);

    // Calculate cursor line position relative to textarea top
    const cursorRelativeTop = textHeight;
    const cursorRelativeBottom = cursorRelativeTop + lineHeight;

    // Get textarea position in viewport
    const textareaRect = textarea.getBoundingClientRect();
    const cursorViewportTop = textareaRect.top + cursorRelativeTop;
    const cursorViewportBottom = textareaRect.top + cursorRelativeBottom;

    // Check if cursor line is visible in viewport
    const windowHeight = window.innerHeight;
    const viewportTop = 0;
    const viewportBottom = windowHeight;

    // Account for padding/margin at bottom
    const bottomPadding = 20; // main-container padding
    const bottomMargin = 16; // textarea margin (1rem)
    const effectiveBottom = viewportBottom - bottomPadding - bottomMargin;

    // Cursor line is visible if it's within the viewport (with tolerance at bottom)
    return cursorViewportTop >= viewportTop && cursorViewportTop < effectiveBottom &&
           cursorViewportBottom > viewportTop;
  };

  const handleChange = useCallback(e => {
    const scrollYBefore = window.scrollY || 0;
    const textarea = textareaRef.current;
    const textareaRect = textarea ? textarea.getBoundingClientRect() : null;
    const cursorPosition = textarea ? textarea.selectionStart : null;

    // Check if cursor line is visible in viewport
    const cursorVisible = isCursorLineVisible(textarea, cursorPosition);

    if (config.debug) {
      console.log('[Scroll Debug] handleChange START:', {
        scrollY: scrollYBefore,
        valueLength: e.target.value.length,
        cursorPos: cursorPosition,
        textareaTop: textareaRect ? textareaRect.top : null,
        textareaBottom: textareaRect ? textareaRect.bottom : null,
        windowHeight: window.innerHeight,
        cursorVisible,
      });
    }

    // Only save scroll position if cursor line is visible in viewport
    // If cursor is not visible, let browser naturally scroll to it
    const scrollYToSave = cursorVisible ? scrollYBefore : null;

    // Pass scroll position to updatePreview (null if cursor not visible)
    // This is critical: we need to save scroll position before updatePreview triggers re-renders
    updatePreview(e.target.value, scrollYToSave);

    // Check scroll after a short delay to catch async changes
    setTimeout(() => {
      const scrollYAfter = window.scrollY || 0;
      if (config.debug && Math.abs(scrollYAfter - scrollYBefore) > 1) {
        console.log('[Scroll Debug] handleChange END (scroll changed):', {
          scrollYBefore,
          scrollYAfter,
          scrollDiff: scrollYAfter - scrollYBefore,
        });
      }
    }, 0);
  }, [updatePreview]);

  useEffect(() => {
    // update textarea value when deafultValue changes
    if (textareaRef.current) {
      textareaRef.current.value = deafultValue;
    }
  }, [deafultValue]);

  const onKeyDown = e => {
    const textArea = textareaRef.current;
    if (!textArea) return;

    if (e.key === 'Tab') {
      if (config.debug) {
        console.log('[Scroll Debug] onKeyDown Tab before:', {
          scrollY: window.scrollY,
          selectionStart: textArea.selectionStart,
        });
      }
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
      // keep preview in sync when using Tab
      updatePreview(textArea.value);
      if (config.debug) {
        console.log('[Scroll Debug] onKeyDown Tab after:', {
          scrollY: window.scrollY,
          selectionStart: textArea.selectionStart,
        });
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      // Use requestAnimationFrame to avoid ResizeObserver loop warnings
      // This defers the resize operation to the next frame, preventing
      // synchronous DOM modifications during ResizeObserver callbacks
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          resize(0, textareaRef.current);
        }
      });
    }
  }, [deafultValue]);

  // global scroll logger - only log significant changes
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY || 0;
      const diff = Math.abs(current - lastScrollYRef.current);

      // Only log if scroll changed significantly (more than 10px) to reduce noise
      if (config.debug && diff > 10) {
        // Debounce scroll logs to avoid flooding
        if (scrollLogDebounceRef.current) {
          clearTimeout(scrollLogDebounceRef.current);
        }
        scrollLogDebounceRef.current = setTimeout(() => {
          console.log('[Scroll Debug] window scroll (significant):', {
            from: lastScrollYRef.current,
            to: current,
            diff: current - lastScrollYRef.current,
          });
        }, 50);
      }
      lastScrollYRef.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollLogDebounceRef.current) {
        clearTimeout(scrollLogDebounceRef.current);
      }
    };
  }, []);

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
