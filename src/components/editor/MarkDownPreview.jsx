/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:50
 * @modify date 2022-08-31 13:00:50
 * @desc markdown preview component
 */
/* eslint-disable react/no-children-prop */
import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import ColorLoading from '../ColorLoading';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

import { handleUrl, externalValidator } from '../../util/url';
import { getInfoByChildren } from '../../util/str';
import config from '../../config';
import styles from '../../styles/editor.module.css';
import markdownPolicy from '../../util/markdown-policy';

const markdownConfig = config.markdown;
const CodeBlock = lazy(() => import('./CodeBlock'));

export default function MarkDownPreview (props) {
  const { markdownFile, markdownString, loading: externalLoading, showHeader = true } = props;
  const [markdownContent, setMarkdownContent] = useState(markdownString || '');
  const [isDelayedLoading, setIsDelayedLoading] = useState(false);
  const previewContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const renderDelay = markdownConfig.renderDelay || 0;

    if (renderDelay > 0) {
      // Show loading state during delay
      setIsDelayedLoading(true);

      // Debounce the content update
      debounceTimerRef.current = setTimeout(() => {
        setMarkdownContent(markdownString);
        setIsDelayedLoading(false);

        if (previewContainerRef.current && config.debug) {
          const heightAfter = previewContainerRef.current.offsetHeight;
          console.log('[Scroll Debug] MarkDownPreview after debounced update:', {
            markdownStringLength: markdownString.length,
            containerHeight: heightAfter,
          });
        }
      }, renderDelay);
    } else {
      // Immediate update if no delay
      setMarkdownContent(markdownString);
      setIsDelayedLoading(false);
    }

    // Cleanup timer on unmount or when markdownString changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [markdownString]);

  useEffect(() => {
    if (markdownFile) {
      fetch(markdownFile)
        .then((response) => response.text())
        .then((text) => {
          setMarkdownContent(text);
        });
    }
  }, [markdownFile])

  return (
    <div className={styles['markdown-preview-container']} ref={previewContainerRef}>
    {showHeader && <h1>Markdown Preview</h1>}
    <div className={`${styles['preview-panel']} article-content`} style={!showHeader ? { border: 0 } : {}}>
      {!markdownContent || externalLoading || isDelayedLoading
        ? <ColorLoading />
        : (<ReactMarkdown
              children={markdownContent}
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex, markdownPolicy]}
              components={{
                code ({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match
                    ? (
                    <Suspense fallback={<code className={className}>{children}</code>}><CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock></Suspense>
                      )
                    : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                      );
                },
                // custom h1, h2 behaviors, add anchor automatically with the title text.
                // Add a  divider behind h1 and h2
                h1 ({ children, node, ...props }) {
                  return <h1 {...props}>{children}</h1>
                },
                h2 ({ children, node, ...props }) {
                  return <h2 {...props}>{children}</h2>
                },
                blockquote ({ children, node, ...props }) {
                  return <blockquote {...props}>{children}</blockquote>
                },
                // custom the link behavior, all internal links will be loaded by setPage from App Component.
                // It's to avoid the influence from different deployment root directory.
                a ({ node, children, ...props }) {
                  // determine if the link is external or internal
                  const href = node?.properties?.href;
                  const external = href ? externalValidator(href) : false;
                  return (
                    <a
                      href={href}
                      title={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer noopener' : undefined}
                      style={node?.properties?.className ? undefined : markdownConfig.linkStyle}
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
                // transform the image path to /resources/[absolute path].
                // In webpack.config.js, I add a rule to package all resources under /src/articles/ to /resources/ with original absolute path.
                // I won't suggest you put resources in your repository, but if you do, it can work with absolution path, not relative path because the relative path can not be parsed in reandering.
                // I suggest you put an image with external link like google drive.
                img ({ node, children, ...props }) {
                  if (externalValidator(node?.properties?.src)) {
                    // external link
                    return (<img style={{ width: 'auto', maxWidth: '100%' }} {...props}></img>)
                  }
                  const finalSrc = node?.properties.src
                  return (
                    <img style={{ width: 'auto', maxWidth: '100%' }} title={node?.properties.alt} alt={node?.properties.alt} {...props} src={finalSrc}>{children}</img>
                  )
                }
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
  showHeader: PropTypes.bool
};
