/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:38:47
 * @modify date 2022-08-31 14:38:47
 * @desc Header component, include content block switching, theme switching, etc.
 */
import React, { useEffect, useState } from 'react';
import config from '../config';
import styles from '../styles/header.module.css';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { handleUrl } from '../util/url';
import { navigate, goBack, selectPage } from '../util/store'
import { compareLowerCase } from '../util/str';
import { useTheme } from './ThemeProvider';

const Header = () => {
  const [headerLinks, setHeaderLinks] = useState([]);
  const page = useSelector(selectPage);
  const dispatch = useDispatch();
  const { isDark, toggleTheme, themeEnabled } = useTheme();

  const setPage = (page) => {
    dispatch(navigate(page));
  }
  const pageUpdate = (item) => {
    handleUrl(item.customUrl || item.title, setPage)
  }
  // render header links with the active page
  const getHeaders = () => {
    const headerLinks = [];
    config.headers.forEach(item => {
      headerLinks.push(
        <li className={styles['header-link-wrapper']} key={`navbar-link-${item.title}`}>
          <a
            className="nav-link"
            data-active={compareLowerCase(item.title, page) || compareLowerCase(item.customUrl, page) ? 'active' : ''}
            onClick={() => pageUpdate(item)}
          >
            {item.title}
          </a>
        </li>
      );
    });
    setHeaderLinks(headerLinks);
  };

  // generate header links with the active page
  useEffect(() => {
    getHeaders();
  }, [page]);

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          {config.title || 'Tempest'}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {headerLinks.length > 0 && (
          <div className="collapse navbar-collapse" id="navbarNav" style={{ justifyContent: 'flex-end' }}>
            <ul className="navbar-nav">{headerLinks}</ul>
          </div>
        )}
        {themeEnabled && (
          <div className={styles['header-controller']}>
            <button
              className={styles['header-theme-toggler']}
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`}></i>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

Header.propTypes = {};
export default Header;
