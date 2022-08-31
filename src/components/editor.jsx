/* eslint-disable react/no-children-prop */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Textarea from 'react-expanding-textarea';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import styles from '../styles/editor.module.css';

import config from '../config.json';
import introfile from '../articles/markdown_intro.md';

export function MarkdownTextarea ({
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
        placeholder={placeholder}
        ref={textareaRef}
        rows="25"
      />
    </div>
  );
}

MarkdownTextarea.propTypes = {
  maxLength: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  deafultValue: PropTypes.string.isRequired,
  updatePreview: PropTypes.func.isRequired
};

export function MarkDownPreview (props) {
  const { markdownFile, markdownString, loading } = props;
  const [markdownContent, setMarkdownContent] = useState('');
  useEffect(() => {
    if (markdownString) {
      setMarkdownContent(markdownString);
    } else if (markdownFile) {
      fetch(markdownFile)
        .then((response) => response.text())
        .then((text) => {
          setMarkdownContent(text);
        });
    }
  }, [markdownString, markdownFile]);

  return (
    <div className={styles['markdown-preview-container']}>
    <h1>Markdown Preview</h1>
    <div className={styles['preview-panel']}>
      {!markdownContent || loading
        ? (
        <div
          className="spinner-border"
          style={{ color: config.colors.light.foreground, marginLeft: '45%', marginTop: '40%' }}
          role="status"
        >
          <span className="sr-only"></span>
        </div>
          )
        : (
            <ReactMarkdown
              children={markdownContent}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                code ({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match
                    ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                      )
                    : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                      );
                }
              }}
            />
          )}
    </div>
    </div>
  );
}

MarkDownPreview.propTypes = {
  markdownFile: PropTypes.object,
  markdownString: PropTypes.string,
  loading: PropTypes.bool
};

const markdownConfig = config.markdown;

export default function MarkDownEditor () {
  const [value, setValue] = useState('# Hello World');
  const [deafultValue, setDeafultValue] = useState('');
  const [triggerLoading, setTriggerLoading] = useState(false);

  let updateDebounce = null;

  const updatePreview = (value) => {
    // debounce the update
    if (updateDebounce) {
      clearTimeout(updateDebounce);
    }
    markdownConfig.loading && setTriggerLoading(true);
    updateDebounce = setTimeout(() => {
      console.log('[debug] set value', value)
      setValue(value);
      markdownConfig.loading && setTriggerLoading(false);
    }, markdownConfig.renderDelay);
  };

  useEffect(() => {
    fetch(introfile)
      .then((response) => response.text())
      .then((text) => {
        setDeafultValue(text);
        setValue(text);
      });
  }, []);
  return (
    <div className="container">
      <div className='row'>
        <div className='col'>
          <MarkdownTextarea
            maxLength={5000}
            placeholder="Write your markdown content here."
            deafultValue={deafultValue}
            updatePreview={updatePreview}
          />
        </div>
        <div className='col'>
          <MarkDownPreview markdownString={value} loading={triggerLoading} />
        </div>
      </div>
    </div>
  );
}
