/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:28
 * @modify date 2022-08-31 13:00:28
 * @desc markdown editor component
 */

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

import MarkdownTextarea from './MarkDownTextarea';
import MarkDownPreview from './MarkDownPreview';
import config from '../../config';
import introfile from '../../articles/markdown_intro.md'; // introduction of how to use markdown
import styles from '../../styles/editor.module.css';

const markdownConfig = config.markdown;

export default function MarkDownEditor () {
  const [markdownString, setMarkdownString] = useState('');
  const [deafultValue, setDeafultValue] = useState('');
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [layout, setLayout] = useState('side-by-side');
  const [visiblePanes, setVisiblePanes] = useState('both');
  const scrollRestoreRef = useRef(null);
  let updateDebounce = null;

  const nextLayout = layout === 'side-by-side' ? 'top-and-bottom' : 'side-by-side';
  const nextVisiblePanes = visiblePanes === 'both' ? 'preview' : visiblePanes === 'preview' ? 'editor' : 'both';
  const layoutLabel = layout === 'side-by-side' ? 'Side by side' : 'Top and bottom';
  const nextLayoutLabel = nextLayout === 'side-by-side' ? 'side by side' : 'top and bottom';
  const visibilityLabels = { both: 'editor and preview', preview: 'preview only', editor: 'editor only' };

  // update the markdown preview part.
  const updatePreview = (v, savedScrollY = null) => {
    // Use provided scroll position if available (null means don't preserve scroll)
    // This allows caller to indicate whether scroll should be preserved
    // null means cursor is not visible, so we should let browser scroll naturally
    const scrollYToSave = savedScrollY !== null ? savedScrollY : null;

    // Get current page height and textarea position BEFORE any updates
    const pageHeightBefore = document.documentElement.scrollHeight;
    const textareaElement = document.getElementById('fancy-markdown-textarea');
    const textareaRectBefore = textareaElement ? textareaElement.getBoundingClientRect() : null;
    const textareaTopBefore = textareaRectBefore ? textareaRectBefore.top + window.scrollY : null;

    if (config.debug) {
      console.log('[Scroll Debug] updatePreview called:', {
        scrollY: scrollYToSave,
        valueLength: v.length,
        currentMarkdownLength: markdownString.length,
        savedScrollYProvided: savedScrollY !== null,
        pageHeightBefore,
        textareaTopBefore,
      });
    }

    // Save scroll position AND layout info BEFORE any state updates
    // This is critical: we need to capture scroll position before any re-renders
    // Only save if scrollYToSave is not null (meaning cursor is visible)
    if (scrollYToSave !== null) {
      scrollRestoreRef.current = {
        scrollY: scrollYToSave,
        pageHeightBefore,
        textareaTopBefore,
      };
    } else {
      // Cursor is not visible, don't preserve scroll - let browser scroll naturally
      scrollRestoreRef.current = null;
    }

    // debounce the update
    if (updateDebounce) {
      clearTimeout(updateDebounce);
    }

    // Don't set loading state if it causes immediate re-render that changes scroll
    // Only set loading if markdownConfig.loading is true AND we're not in a rapid update cycle
    if (markdownConfig.loading) {
      setTriggerLoading(true);
    }

    updateDebounce = setTimeout(() => {
      setMarkdownString(v);
      if (markdownConfig.loading) {
        setTriggerLoading(false);
      }
    }, markdownConfig.renderDelay);
  };

  // Restore scroll position after markdown preview updates
  // Use both useLayoutEffect and useEffect to catch all render phases
  useLayoutEffect(() => {
    if (scrollRestoreRef.current !== null) {
      const restoreInfo = scrollRestoreRef.current;
      const savedScrollY = restoreInfo.scrollY || restoreInfo; // Support both old and new format
      const currentScrollY = window.scrollY || 0;

      // Calculate how much the page height changed
      const pageHeightAfter = document.documentElement.scrollHeight;
      const pageHeightBefore = typeof restoreInfo === 'object' ? restoreInfo.pageHeightBefore : pageHeightAfter;
      const pageHeightDiff = pageHeightAfter - pageHeightBefore;

      // Calculate textarea position change
      const textareaElement = document.getElementById('fancy-markdown-textarea');
      const textareaRectAfter = textareaElement ? textareaElement.getBoundingClientRect() : null;
      const textareaTopBefore = typeof restoreInfo === 'object' ? restoreInfo.textareaTopBefore : null;
      const textareaTopAfter = textareaRectAfter ? textareaRectAfter.top + window.scrollY : null;
      const textareaTopDiff = textareaTopBefore && textareaTopAfter ? textareaTopAfter - textareaTopBefore : 0;

      if (config.debug) {
        console.log('[Scroll Debug] useLayoutEffect - Layout analysis:', {
          scrollYBefore: savedScrollY,
          scrollYCurrent: currentScrollY,
          scrollDiff: currentScrollY - savedScrollY,
          pageHeightBefore,
          pageHeightAfter,
          pageHeightDiff,
          textareaTopBefore,
          textareaTopAfter,
          textareaTopDiff,
        });
      }

      // Key insight: If page height decreased, browser may have scrolled up to maintain scroll position
      // If page height increased, browser may have scrolled down
      // We need to restore to the saved position regardless of height changes
      const targetScrollY = savedScrollY;

      // If page height decreased significantly, this might explain why browser scrolled up
      if (pageHeightDiff < 0 && Math.abs(pageHeightDiff) > 10) {
        if (config.debug) {
          console.log('[Scroll Debug] Page height decreased, browser may have over-scrolled');
        }
      }

      // Only restore if scroll was changed (likely by browser's automatic adjustment)
      if (Math.abs(currentScrollY - savedScrollY) > 1) {
        if (config.debug) {
          console.log('[Scroll Debug] Restoring scroll (useLayoutEffect):', {
            from: currentScrollY,
            to: targetScrollY,
            diff: targetScrollY - currentScrollY,
            reason: 'Browser auto-scrolled due to layout change',
            pageHeightDiff,
          });
        }
        // Restore synchronously in useLayoutEffect (before browser paint)
        window.scrollTo(0, targetScrollY);
      }
    }
  });

  // Also restore in useEffect to catch any async scroll changes after paint
  useEffect(() => {
    if (scrollRestoreRef.current !== null) {
      const restoreInfo = scrollRestoreRef.current;
      const savedScrollY = typeof restoreInfo === 'object' ? restoreInfo.scrollY : restoreInfo;

      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY || 0;
        if (Math.abs(currentScrollY - savedScrollY) > 1) {
          if (config.debug) {
            console.log('[Scroll Debug] Restoring scroll (useEffect):', {
              from: currentScrollY,
              to: savedScrollY,
              diff: savedScrollY - currentScrollY,
            });
          }
          window.scrollTo(0, savedScrollY);

          // One more check after a microtask to handle any remaining async changes
          Promise.resolve().then(() => {
            const finalScrollY = window.scrollY || 0;
            if (Math.abs(finalScrollY - savedScrollY) > 1) {
              if (config.debug) {
                console.log('[Scroll Debug] Restoring scroll (microtask):', {
                  from: finalScrollY,
                  to: savedScrollY,
                  diff: savedScrollY - finalScrollY,
                });
              }
              window.scrollTo(0, savedScrollY);
            }
            // Clear the restore flag after all attempts
            scrollRestoreRef.current = null;
          });
        } else {
          // Clear the restore flag if no restoration needed
          scrollRestoreRef.current = null;
        }
      });
    }
  });

  // load introduction of markdown file as default value.
  useEffect(() => {
    fetch(introfile)
      .then((response) => response.text())
      .then((text) => {
        setDeafultValue(text);
        setMarkdownString(text);
      });
  }, []);

  return (
    <div className={styles['markdown-workspace']}>
      <div className={styles['layout-toolbar']}>
        <div className={styles['view-controls']} role="group" aria-label="Editor view controls">
          <button
            type="button"
            className={styles['view-button']}
            aria-label={`Layout: ${layoutLabel}. Switch to ${nextLayoutLabel}`}
            title={`Layout: ${layoutLabel}. Switch to ${nextLayoutLabel}`}
            onClick={() => setLayout(nextLayout)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="15" rx="2" />
              {layout === 'side-by-side' ? <path d="M12 4.5v15" /> : <path d="M3 12h18" />}
            </svg>
          </button>
          <button
            type="button"
            className={styles['view-button']}
            aria-label={`Visible panes: ${visibilityLabels[visiblePanes]}. Show ${visibilityLabels[nextVisiblePanes]}`}
            title={`Visible panes: ${visibilityLabels[visiblePanes]}. Show ${visibilityLabels[nextVisiblePanes]}`}
            onClick={() => setVisiblePanes(nextVisiblePanes)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 11.5s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
              <circle cx="12" cy="11.5" r="2.5" />
              <path d="M6 20h4.5" strokeWidth="2.8" opacity={visiblePanes === 'preview' ? '.2' : '1'} />
              <path d="M13.5 20H18" strokeWidth="2.8" opacity={visiblePanes === 'editor' ? '.2' : '1'} />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`${styles['editor-panes']} ${styles[layout]}`}
        data-layout={layout}
        data-visible={visiblePanes}
      >
        <div className={styles['editor-pane']} aria-hidden={visiblePanes === 'preview'}>
          <MarkdownTextarea
            placeholder="Write your markdown content here."
            deafultValue={deafultValue}
            updatePreview={updatePreview}
          />
        </div>
        <div className={styles['preview-pane']} aria-hidden={visiblePanes === 'editor'}>
          <MarkDownPreview markdownString={markdownString} loading={triggerLoading} />
        </div>
      </div>
    </div>
  );
}
