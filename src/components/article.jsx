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
import { navigate, goBack, selectPage, selectFilePath } from '../util/store'
import MarkDownPreview from './editor/markDownPreview';
import FlipButton from './FlipButton';
import MarkdownTextarea from './editor/markDownTextarea';
import ColorLoading from './colorLoading';
import NotFound from '../articles/404.md';
import { codeIcon, paragraphIcon } from '../util/icons';

const { debug } = config;

const Article = () => {
  const filePath = useSelector(selectFilePath);
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
      setTimeout(() => {
        setLoading(false);
      }, 500)
    }
    debug && console.log('[debug][article.jsx] filePath update:', filePath)

    fetch(filePath)
      .then((response) => response.text())
      .then((text) => {
        setMarkdownContent(text);
      });
  }, [filePath])

  return (
    <div className='container'>
      {filePath
        ? (
          <div>
            <div className={styles['top-right-button']}>
              <FlipButton
                onClick={switchMode}
                open={false}
                closeElement={<img className={styles['small-icon']} src={paragraphIcon} />}
                openElement={<img className={styles['small-icon']} src={codeIcon} />}
                size="small" />
            </div>
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
