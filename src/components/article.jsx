/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:38:15
 * @modify date 2022-08-31 14:38:15
 * @desc article template component
 */
import React, { useEffect, useState } from 'react';
// import styles from '../styles/article.module.css';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, goBack, selectPage, selectFilePath } from '../util/store'
import MarkDownPreview from './editor/markDownPreview';
import ColorLoading from './colorLoading';
import NotFound from '../articles/404.md';

const Article = () => {
  const filePath = useSelector(selectFilePath);
  const [loading, setLoading] = useState(!filePath);
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
  }, [filePath])

  return (
    <div className='container'>
      {filePath
        ? (
        <MarkDownPreview markdownFile={filePath} showPreviewHeader={false} setPage={setPage} />
          )
        : loading
          ? (
            <ColorLoading />
            )
          : <MarkDownPreview markdownFile={NotFound} showPreviewHeader={false} setPage={setPage} />}
    </div>
  );
};

Article.propTypes = {};
export default Article;
