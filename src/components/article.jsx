/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:38:15
 * @modify date 2022-08-31 14:38:15
 * @desc article template component
 */
import React, { useEffect, useState } from 'react';
import styles from '../styles/article.module.css';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, goBack, selectPage, selectFilePath } from '../util/store'
import MarkDownPreview from './editor/markDownPreview';
import FlipButton from './FlipButton';
import MarkdownTextarea from './editor/markDownTextarea';
import ColorLoading from './colorLoading';
import NotFound from '../articles/404.md';

const Article = () => {
  const filePath = useSelector(selectFilePath);
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(!filePath);
  const [mode, setMode] = useState('preview');

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

  // load article with filePath
  useEffect(() => {
    if (!filePath) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500)
    }

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
              <FlipButton onClick={switchMode} open={false} closeElement={'View'} openElement={'Raw'} size="small" />
            </div>
            {mode !== 'preview' && <MarkdownTextarea showHeader={false} deafultValue={markdownContent} updatePreview={() => {}} />}
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
