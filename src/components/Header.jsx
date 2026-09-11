import React, { useState } from 'react';
import config from '../config';
import { useSelector } from 'react-redux';
import { selectPage } from '../util/store';
import { formatLink } from '../util/url';
import { useTheme } from './ThemeProvider';

const PortfolioIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 8 4.5v9.2l-8 4.7-8-4.7V7.3Z" /><path d="m4 7.3 8 4.6 8-4.6M12 11.9v9.3" /></svg>;

export default function Header () {
  const page = useSelector(selectPage);
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme, themeEnabled } = useTheme();
  return (
    <header className="site-header">
      <div className="site-identity"><a className="site-brand" href="/">{config.title}</a><span className="site-tagline">thoughts, in Markdown <span aria-hidden="true">❧</span></span></div>
      <div className="header-controls">
        <button className="menu-toggle" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>Menu</button>
        <nav id="site-navigation" aria-label="Main navigation" className={open ? 'site-nav is-open' : 'site-nav'}>
          {config.headers.map(item => {
            const destination = item.customUrl || item.title;
            const external = /^https?:/.test(destination);
            const portfolio = destination === 'https://3d.tempest.fun/';
            return <a key={item.title} className={portfolio ? 'site-nav-icon' : undefined} href={external ? destination : formatLink(destination)} aria-current={!external && destination.toLowerCase() === page.toLowerCase() ? 'page' : undefined} aria-label={portfolio ? item.title : undefined} title={portfolio ? item.title : undefined} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{portfolio ? <><PortfolioIcon /><span className="site-nav-icon-label">{item.title}</span></> : item.title}</a>;
          })}
        </nav>
        {themeEnabled && <button className="theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}><svg viewBox="0 0 24 24" aria-hidden="true">{isDark ? <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> : <path d="M20 15.2A8.2 8.2 0 0 1 8.8 4 8.2 8.2 0 1 0 20 15.2Z" />}</svg></button>}
      </div>
    </header>
  );
}
