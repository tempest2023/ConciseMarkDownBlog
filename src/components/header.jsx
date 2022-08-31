import React, { useEffect, useState } from 'react';
import config from '../config.json';
import style from '../styles/header.module.css';
import PropTypes from 'prop-types';

// const ThemeChange = (props) => {
//   const { themeMode, switchThemeMode } = props;
//   return (
//     <span className={style['header-theme-toggler']} onClick={switchThemeMode}>
//       <i className={themeMode =='light' ? "bi bi-laptop" : "bi bi-laptop-fill"}></i>
//     </span>
//   );
// };

const Header = (props) => {
  const [headerLinks, setHeaderLinks] = useState([]);
  const { setData } = props;
  const getLink = (link) => {
    return `${link}`;
  };
  const getHeaders = () => {
    const headerLinks = [];
    config.headers.forEach((item) => {
      headerLinks.push(
        <div
          className={style['header-link-wrapper']}
          key={`header-link-wrapper[${item.title}]`}
        >
          <span onClick={setData(getLink(item.link))}>{item.title}</span>
        </div>
      );
    });
    setHeaderLinks(headerLinks);
  };
  useEffect(() => {
    getHeaders();
  }, []);
  return (
    <div className={style['header-container']}>
      <div className={style['header-title']}>{config.title || 'Tempest'}</div>
      <div className={style['header-links']}>{headerLinks}</div>
    </div>
  );
};

Header.propTypes = {
  setData: PropTypes.func.isRequired
}
export default Header;
