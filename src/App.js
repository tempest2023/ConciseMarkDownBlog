/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:40:35
 * @modify date 2022-09-19 18:53:48
 * @desc App
 */
import React, { useEffect, useState } from 'react';
import config from './config';
import Article from './components/article';
import MarkDownEditor from './components/editor/editor';
import Header from './components/header';
import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { getUrlParameters, formatPage } from './util/url';
import { compareLowerCase } from './util/str';

const articles = {};
// import the article resources by require.context
const articleContext = require.context('/src/articles/', true, /\.(md|jpg|png|gif|jpeg|mp4|mp3|avi|ogg)$/);

function importAllArticles (r) {
  r.keys().forEach((key) => (articles[key] = r(key)));
}
importAllArticles(articleContext)

const getFilePath = (page) => {
  // if the path not in the articles, which is the maps from the original aricle path to the bundle path created by require.context
  const path = formatPage(page);
  if (!articles[path]) {
    return null;
  }
  // dynamically import the article resource by articles
  return articles[path];
}

const App = () => {
  const [page, setPage] = useState('');
  // [TODO] setPage supprot going back
  // [TODO] use better way to transfer setPage to markdownPreview Component.
  useEffect(() => {
    const params = getUrlParameters() || {};
    // internal links
    if (params.page) {
      setPage(params.page);
    } else {
      setPage(config.default)
    }
  }, [])

  // set document title
  useEffect(() => {
    document.title = config.title;
  }, [])

  return (
    <div className='page'>
      <Header setPage={setPage} page={page}/>
      <div className='main-container'>
        {!config.markdown.enable
          ? <Article filePath={getFilePath(page)} />
          : (compareLowerCase(page, 'Markdown')
              ? <MarkDownEditor setPage={setPage} />
              : <Article filePath={getFilePath(page)} setPage={setPage} />)
        }
      </div>
    </div>
  );
};

export default App;
