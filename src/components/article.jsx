/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:38:15
 * @modify date 2022-08-31 14:38:15
 * @desc article template component
 */
import React, { useEffect, useState } from 'react';
import config from '../config';
// import styles from '../styles/article.module.css';
import PropTypes from 'prop-types';
import MarkDownPreview from './editor/markDownPreview';
import NotFound from '../articles/404.md';

const Article = props => {
  const { filePath, setPage } = props;
  const [loading, setLoading] = useState(!filePath);
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
        <div
          className='spinner-border'
          style={{
            color: config.colors.light.foreground
          }}
          role='status'
        >
          <span className='sr-only'></span>
        </div>
            )
          : <MarkDownPreview markdownFile={NotFound} showPreviewHeader={false} setPage={setPage} />}
    </div>
  );
};

Article.propTypes = {
  setPage: PropTypes.func.isRequired,
  filePath: PropTypes.string
};
export default Article;
