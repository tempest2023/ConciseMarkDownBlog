import React, { useState } from 'react';
import config from '../config';
import { useSelector } from 'react-redux';
import { selectPage } from '../util/store';
import { formatLink } from '../util/url';
import { useTheme } from './ThemeProvider';

export default function Header () {
  const page = useSelector(selectPage);
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme, themeEnabled } = useTheme();
  return (
    <header className="site-header">
      <a className="site-brand" href="/">{config.title}</a>
      <div className="header-controls">
        <button className="menu-toggle" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>Menu</button>
        <nav id="site-navigation" aria-label="Main navigation" className={open ? 'site-nav is-open' : 'site-nav'}>
          {config.headers.map(item => {
            const destination = item.customUrl || item.title;
            return <a key={item.title} href={/^https?:/.test(destination) ? destination : formatLink(destination)} aria-current={destination.toLowerCase() === page.toLowerCase() ? 'page' : undefined}>{item.title}</a>;
          })}
        </nav>
        {themeEnabled && <button className="theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}><span aria-hidden="true">{isDark ? '☀' : '☾'}</span></button>}
      </div>
    </header>
  );
}
