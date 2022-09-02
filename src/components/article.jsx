/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:38:15
 * @modify date 2022-08-31 14:38:15
 * @desc article template component
 */
import React, { useEffect, useState } from 'react';
import config from '../config';
import styles from '../styles/article.module.css';
import PropTypes from 'prop-types';
import MarkDownPreview from './editor/markDownPreview';

const EmptyContent = (props) => {
  const { page } = props;
  return <div className='container'>
    <div className='row'>
      <h1>404</h1>
      <p>Article {page} not found</p>
    </div>
  </div>
};

EmptyContent.propTypes = {
  page: PropTypes.string.isRequired
}

const Article = (props) => {
  const [file, setFile] = useState(null);
  const { page } = props;
  useEffect(() => {
    // load article by require the markdown file
    let mdfile
    try {
      mdfile = require('../articles/' + page + '.md');
    } catch (e) {
      // file not exist
      console.log('[debug] file not exist', e);
    }
    setFile(mdfile);
  }, [page]);
  return <div className='container'>
       {file ? <MarkDownPreview markdownFile={file} showPreviewHeader={false} /> : <EmptyContent page={page} />}
      </div>;
};

Article.propTypes = {
  page: PropTypes.string.isRequired
}
export default Article;
