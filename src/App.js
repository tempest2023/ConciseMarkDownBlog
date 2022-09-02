/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:40:35
 * @modify date 2022-09-02 17:58:18
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

import { getUrlParameters } from './util/url';
import { compareLowerCase } from './util/str';

const App = () => {
  const [page, setPage] = useState(config.default);
  useEffect(() => {
    const params = getUrlParameters() || {};
    if (params.page) {
      setPage(params.page);
    }
  }, [])
  return (
    <div className='page'>
      <Header setPage={setPage} page={page}/>
      <div className='main-container'>
        { compareLowerCase(page, 'Markdown')
          ? <MarkDownEditor page={config.default}/>
          : <Article page={page}/>
        }
      </div>
    </div>
  );
};

export default App;
