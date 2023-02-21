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

  const handleChange = useCallback(e => {
    updatePreview(e.target.value);
  }, []);

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
    }
    // after shotcut keydown, update the preview
    updatePreview(textArea.value)
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
