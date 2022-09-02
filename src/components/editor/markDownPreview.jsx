/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:50
 * @modify date 2022-08-31 13:00:50
 * @desc markdown preview component
 */
/* eslint-disable react/no-children-prop */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { openUrl } from '../../util/url';
import config from '../../config';

import styles from '../../styles/editor.module.css';

export default function MarkDownPreview (props) {
  const { markdownFile, markdownString, loading, showPreviewHeader = true } = props;
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
    {showPreviewHeader && <h1>Markdown Preview</h1>}
    <div className={styles['preview-panel']} style={!showPreviewHeader ? { border: 0 } : {}}>
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
              remarkPlugins={[remarkGfm, remarkMath]}
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
                },

                h1 ({ children, ...props }) {
                  return <><h1 {...props}>{children}</h1><hr /></>
                },

                h2 ({ children, ...props }) {
                  return <><h1 {...props}>{children}</h1><hr /></>
                },

                blockquote ({ children, ...props }) {
                  return <blockquote style={ { borderLeft: '3px solid #ddd', paddingLeft: '0.5em', color: '#bbb' } } {...props}>{children}</blockquote>
                }

                // custom the link behavior
                // a ({ node, children, ...props }) {
                //   return (
                //     <a href="#" title={node?.properties?.href} onClick={() => openUrl(node?.properties?.href)} {...props}>
                //       {children}
                //     </a>
                //   );
                // }
              }}
            />
          )}
    </div>
    </div>
  );
}

MarkDownPreview.propTypes = {
  markdownFile: PropTypes.string,
  markdownString: PropTypes.string,
  loading: PropTypes.bool,
  showPreviewHeader: PropTypes.bool
}
