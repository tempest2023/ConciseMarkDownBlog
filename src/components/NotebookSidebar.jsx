import React from 'react';
import { topics, postCount } from '../util/sidebar-data';

export default function NotebookSidebar () {
  return <aside className="notebook-sidebar" aria-label="Notebook navigation">
    <nav className="notebook-links" aria-label="Explore the notebook">
      <a href="/"><span aria-hidden="true">⌂</span>Home</a>
      <a href="/writing/"><span aria-hidden="true">▤</span>All writing <small>{postCount}</small></a>
      <a href="/work/"><span aria-hidden="true">♧</span>Work & research</a>
    </nav>
    <div className="notebook-topics"><p className="sidebar-label">Filed under</p>{topics.slice(0, 7).map(topic => <a key={topic.name} href={topic.href}>{topic.name === 'DeepLearning' ? 'Deep learning' : topic.name}<small>{topic.count}</small></a>)}<a href="/writing/" className="all-topics">All topics <span aria-hidden="true">↗</span></a></div>
    <div className="notebook-colophon"><p>A small space<br />for unfinished thoughts<br />and things worth sharing.</p><span>— Tempest</span><a href="https://github.com/tempest2023/ConciseMarkDownBlog">Made of Markdown <span aria-hidden="true">↗</span></a></div>
  </aside>;
}
