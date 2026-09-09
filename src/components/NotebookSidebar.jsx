import React from 'react';
import PropTypes from 'prop-types';
import { topics, postCount } from '../util/sidebar-data';

const Icon = ({ name }) => {
  if (name === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 11 8.5-7 8.5 7" /><path d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6" /></svg>;
  if (name === 'writing') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4.5" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h8.5l7.5 7.5-7 7-7.5-7.5Z" /><circle cx="9" cy="9.5" r="1" /></svg>;
};
Icon.propTypes = { name: PropTypes.oneOf(['home', 'writing', 'work']).isRequired };

export default function NotebookSidebar () {
  return <aside className="notebook-sidebar" aria-label="Notebook navigation">
    <nav className="notebook-links" aria-label="Explore the notebook">
      <a href="/"><Icon name="home" /><span>Home</span></a>
      <a href="/writing/"><Icon name="writing" /><span>All writing</span><small>{postCount}</small></a>
      <a href="/work/"><Icon name="work" /><span>Work & research</span></a>
    </nav>
    <div className="notebook-topics"><p className="sidebar-label">Filed under</p>{topics.slice(0, 7).map(topic => <a key={topic.name} href={topic.href}>{topic.name === 'DeepLearning' ? 'Deep learning' : topic.name}<small>{topic.count}</small></a>)}<a href="/writing/" className="all-topics">All topics <span aria-hidden="true">↗</span></a></div>
    <div className="notebook-colophon"><p>A small space<br />for unfinished thoughts<br />and things worth sharing.</p><span>— Tempest</span><a href="https://github.com/tempest2023/ConciseMarkDownBlog">Made of Markdown <span aria-hidden="true">↗</span></a></div>
  </aside>;
}
