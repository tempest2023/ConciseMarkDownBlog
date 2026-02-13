/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:01:07
 * @modify date 2022-08-31 13:01:07
 * @desc markdown input component with fixed scroll behavior
 */

import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import styles from '../../styles/editor.module.css';

const markdownConfig = config.markdown;

/**
 * Auto-resize textarea without scroll jump
 * Uses a shadow textarea to calculate height without affecting layout
 * @param {HTMLTextAreaElement} textarea
 * @param {number} minRows
 */
const autoResize = (textarea, minRows = 25) => {
  if (!textarea) return;

  // Save scroll position
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  // Get current height before any changes
  const currentHeight = textarea.offsetHeight;

  // Calculate new height using scrollHeight
  const newHeight = Math.max(textarea.scrollHeight, minRows * 20);

  // Only update if height actually needs to change
  if (Math.abs(newHeight - currentHeight) > 5) {
    // Use requestAnimationFrame to batch the changes
    requestAnimationFrame(() => {
      textarea.style.height = `${newHeight}px`;

      // Restore scroll position synchronously
      window.scrollTo(scrollX, scrollY);

      // Double-check after paint
      requestAnimationFrame(() => {
        if (window.scrollY !== scrollY) {
          window.scrollTo(scrollX, scrollY);
        }
      });
    });
  }
};

export default function MarkdownTextarea ({
  maxLength,
  placeholder,
  deafultValue,
  updatePreview,
  showHeader
}) {
  const textareaRef = useRef(null);
  const isTypingRef = useRef(false);
  const savedScrollRef = useRef({ x: 0, y: 0 });
  const typingTimeoutRef = useRef(null);

  const handleChange = useCallback((e) => {
    updatePreview(e.target.value);
  }, [updatePreview]);

  // Initialize textarea value
  useEffect(() => {
    if (textareaRef.current && deafultValue !== undefined) {
      textareaRef.current.value = deafultValue;
      // Initial resize without scroll jump
      autoResize(textareaRef.current, 25);
    }
  }, [deafultValue]);

  const onKeyDown = (e) => {
    const textArea = textareaRef.current;
    if (!textArea) return;

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
      updatePreview(textArea.value);
    }
  };

  // Handle input with scroll preservation
  const handleInput = useCallback((e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Mark typing state
    isTypingRef.current = true;

    // Save scroll position
    savedScrollRef.current = {
      x: window.scrollX,
      y: window.scrollY
    };

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Update preview
    handleChange(e);

    // Auto-resize with scroll preservation
    autoResize(textarea, 25);

    // Reset typing state after delay
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 150);
  }, [handleChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles['markdown-editor-container']}>
      {showHeader && <h1>Markdown Editor</h1>}
      <textarea
        className={styles['fancy-textarea']}
        id='fancy-markdown-textarea'
        onKeyDown={onKeyDown}
        onInput={handleInput}
        defaultValue={deafultValue}
        maxLength={maxLength}
        placeholder={placeholder}
        ref={textareaRef}
        rows={25}
        style={{
          overflow: 'hidden',
          resize: 'none',
          minHeight: '500px'
        }}
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
