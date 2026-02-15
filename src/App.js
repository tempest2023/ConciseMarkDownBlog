/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:40:35
 * @modify date 2023-02-19 18:03:59
 * @desc App
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import config from './config';
import Article from './components/Article';
import MarkDownEditor from './components/editor/Editor';
import ConfigEditor from './components/config/ConfigEditor';
// import MarkDownEditor from './components/editor/SlashEditor';
import Header from './components/Header';
import Footer from './components/Footer';
import ConfigButton from './components/ConfigButton';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { getUrlParameters } from './util/url';
import { compareLowerCase } from './util/str';
import { navigate, goBack, selectHistory, selectPage } from './util/store'
import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const { debug } = config;

const AppContent = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectPage);
  const history = useSelector(selectHistory);
  const { isDark } = useTheme();

  const popstateHandler = (e) => {
    // click the goBack button on browser
    // go back to the previous page in history list.
    dispatch(goBack());
  }

  useEffect(() => {
    debug && console.log('[debug] component reload as page: ', page);
    window.addEventListener('popstate', popstateHandler);
    // set document title
    document.title = config.title;

    // url param navigation
    const params = getUrlParameters() || {};
    // internal links
    if (!params.page || params.page === page) {
      return;
    }
    dispatch(navigate(params.page));

    return () => {
      window.removeEventListener('popstate', popstateHandler);
    };
  }, []);

  const renderContent = () => {
    // Config editor page (local access only)
    if (compareLowerCase(page, 'config')) {
      return <ConfigEditor />;
    }

    // Markdown editor page
    if (config.markdown.enable && compareLowerCase(page, 'Markdown')) {
      return <MarkDownEditor />;
    }

    // Default article view
    return <Article />;
  };

  return (
    <div className={`page ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <Header />
      <div className="main-container">
        {renderContent()}
      </div>
      <Footer />
      <ConfigButton />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
