import React, { useState } from 'react';
import config from './config.json';
import Article from './components/article';
import Editor from './components/editor';
import Header from './components/header';
import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  const [data, setData] = useState(config.default);
  return (
    <div className='page'>
      <Header setData={setData}/>
      <div className='main-container'>
        { data === 'editor'
          ? <Editor data={config.default}/>
          : <Article data={data}/>
        }
      </div>
    </div>
  );
};

export default App;
