/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:38:15
 * @modify date 2022-08-31 14:38:15
 * @desc article template component
 */
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styles from '../styles/article.module.css';
import PropTypes from 'prop-types';
import config from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, selectPage, selectFilePath } from '../util/store'
import MarkDownPreview from './editor/MarkDownPreview';
import FlipButton from './FlipButton';
import MarkdownTextarea from './editor/MarkDownTextarea';
import ColorLoading from './ColorLoading';
import NotFound from '../articles/404.md';
import { codeIcon, paragraphIcon } from '../util/icons';
import { updateSeoMetadata } from '../util/seo';
import { hasConfigAccess } from '../util/isLocal';

const { debug } = config;

const Article = () => {
  const filePath = useSelector(selectFilePath);
  const page = useSelector(selectPage);
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(!filePath);
  const [mode, setMode] = useState('preview');
  const scrollRestoreRef = useRef(null);

  const switchMode = () => {
    if (mode === 'preview') {
      setMode('raw')
    } else {
      setMode('preview')
    }
  }

  const dispatch = useDispatch();
  const setPage = (page) => {
    dispatch(navigate(page));
  }

  // update markdown content in raw mode and optionally preserve scroll
  const updateRawMarkdown = (value, savedScrollY = null) => {
    // Only preserve scroll when caller indicates the cursor line is visible
    if (savedScrollY !== null) {
      scrollRestoreRef.current = savedScrollY;
    } else {
      scrollRestoreRef.current = null;
    }
    setMarkdownContent(value);
  };

  // Restore scroll position after markdown content updates in raw mode
  useLayoutEffect(() => {
    if (scrollRestoreRef.current !== null) {
      const savedScrollY = scrollRestoreRef.current;
      const currentScrollY = window.scrollY || 0;

      // Only restore if scroll was changed (likely by browser's automatic adjustment)
      if (Math.abs(currentScrollY - savedScrollY) > 1) {
        if (debug) {
          console.log('[Scroll Debug][Article] Restoring scroll after raw markdown update:', {
            from: currentScrollY,
            to: savedScrollY,
            diff: savedScrollY - currentScrollY,
          });
        }
        window.scrollTo(0, savedScrollY);
      }

      // Clear restore flag
      scrollRestoreRef.current = null;
    }
  }, [markdownContent]);

  // load article with filePath
  useEffect(() => {
    if (!filePath) {
      setLoading(true);
      updateSeoMetadata({ page, noIndex: true, title: 'Page not found' });
      setTimeout(() => {
        setLoading(false);
      }, 500)
      return;
    }
    debug && console.log('[debug][article.jsx] filePath update:', filePath)

    let cancelled = false;
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => {
        if (!cancelled) {
          setMarkdownContent(text);
          setLoading(false);
          updateSeoMetadata({ page, markdown: text });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filePath, page])

  return (
    <div className="container">
      {filePath
        ? (
          <div>
            {hasConfigAccess() && <div className="article-tools"><button onClick={switchMode} aria-pressed={mode === 'raw'}>{mode === 'raw' ? 'Read article' : 'View Markdown'}</button></div>}
            {mode !== 'preview' && (
              <MarkdownTextarea
                showHeader={false}
                deafultValue={markdownContent}
                updatePreview={updateRawMarkdown}
              />
            )}
            {mode === 'preview' &&
            <MarkDownPreview markdownString={markdownContent} showHeader={false} setPage={setPage} />}
          </div>
          )
        : loading
          ? (
            <ColorLoading />
            )
          : <MarkDownPreview markdownFile={NotFound} showHeader={false} setPage={setPage} />}
    </div>
  );
};

Article.propTypes = {};
export default Article;
