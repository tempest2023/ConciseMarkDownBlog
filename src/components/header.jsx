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
import { handleUrl } from '../util/url';
import { compareLowerCase } from '../util/str';

const Header = props => {
  const [headerLinks, setHeaderLinks] = useState([]);
  const { setPage, page } = props;
  const pageUpdate = (item) => {
    handleUrl(item.customUrl || item.title, setPage)
  }
  const getHeaders = () => {
    const headerLinks = [];
    config.headers.forEach(item => {
      headerLinks.push(
        <li className={styles['header-link-wrapper']} key={`navbar-link-${item.title}`}>
          <a
            className='nav-link'
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
  useEffect(() => {
    getHeaders();
  }, [page]);
  return (
    <nav className='navbar navbar-expand-lg bg-light'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='/'>
          {config.title || 'Tempest'}
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        {headerLinks.length > 0 && (
          <div className='collapse navbar-collapse' id='navbarNav' style={{ justifyContent: 'flex-end' }}>
            <ul className='navbar-nav'>{headerLinks}</ul>
          </div>
        )}
      </div>
    </nav>
  );
};

Header.propTypes = {
  page: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};
export default Header;
