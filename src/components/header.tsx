import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import config from '../../config.json';
import style from '../styles/header.module.css';

interface header {
  title: string;
  link: string;
  color?: string;
}

// const ThemeChange = (props) => {
//   const { themeMode, switchThemeMode } = props;
//   return (
//     <span className={style['header-theme-toggler']} onClick={switchThemeMode}>
//       <i className={themeMode =='light' ? "bi bi-laptop" : "bi bi-laptop-fill"}></i>
//     </span>
//   );
// };

const Header = () => {
  const [headerLinks, setHeaderLinks] = useState([]);
  const getLink = (link) => {
    return `/${link}`;
  };
  const getHeaders = () => {
    const headerLinks = [];
    config.headers.forEach((item: header) => {
      headerLinks.push(
        <div
          className={style['header-link-wrapper']}
          key={`header-link-wrapper[${item.title}]`}
        >
          <Link href={getLink(item.link)}>{item.title}</Link>
        </div>,
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
export default Header;
