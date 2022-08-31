/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:01:07
 * @modify date 2022-08-31 13:01:07
 * @desc markdown input component
 */

import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-expanding-textarea';

import styles from '../styles/editor.module.css';

export default function MarkdownTextarea ({
  maxLength,
  placeholder,
  deafultValue,
  updatePreview
}) {
  const textareaRef = useRef();

  const handleChange = useCallback((e) => {
    updatePreview(e.target.value);
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className={styles['markdown-editor-container']}>
      <h1>Markdown Editor</h1>
      <Textarea
        className={styles['fancy-textarea']}
        defaultValue={deafultValue}
        id="fancy-markdown-textarea"
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder}
        ref={textareaRef}
        rows="25"
      />
    </div>
  );
}

MarkdownTextarea.propTypes = {
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  deafultValue: PropTypes.string.isRequired,
  updatePreview: PropTypes.func.isRequired
}
