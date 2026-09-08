'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { pagePath } = require('../src/util/routes');
const root = path.resolve(__dirname, '..');
const articlesRoot = path.join(root, 'src/articles');
const profile = require('../src/data/profile.json');
const seo = require('../src/seo.config.json');
const strip = (value = '') => value.replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]*>/g, ' ').replace(/[`*_#>|~]/g, '').replace(/\s+/g, ' ').trim();
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
function dates(file) {
  const relative = path.relative(root, file);
  let history = [];
  try { history = execFileSync('git', ['log', '--format=%cI', '--follow', '--', relative], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split('\n').filter(Boolean); } catch {}
  const fallback = fs.statSync(file).mtime.toISOString();
  return { publishedAt: history.at(-1) || fallback, updatedAt: history[0] || fallback };
}
function catalog() {
  const entries = walk(articlesRoot).filter(file => file.endsWith('.md') && !['404.md', 'markdown_intro.md'].includes(path.relative(articlesRoot, file))).map(file => {
    const page = path.relative(articlesRoot, file).replace(/\\/g, '/').replace(/\.md$/, '');
    const markdown = fs.readFileSync(file, 'utf8');
    const title = strip(markdown.match(/^#{1,3}\s+(.+)$/m)?.[1] || page.split('/').pop());
    const blocks = markdown.replace(/<!--[\s\S]*?-->/g, '').split(/\n\s*\n/);
    const paragraph = blocks.find(block => block.trim() && !/^\s*(#|<|[-*+] |```|!\[)/.test(block));
    const description = strip(paragraph || '').slice(0, 180) || title;
    const timestamps = dates(file);
    if (['About', 'Work'].includes(page)) timestamps.updatedAt = dates(path.join(root, 'src/data/profile.json')).updatedAt;
    return { page, path: pagePath(page), title, description, ...timestamps, category: page.startsWith('Blogs/') ? page.split('/')[1] : 'Pages', readingMinutes: Math.max(1, Math.ceil(strip(markdown).split(/\s+/).length / 220)), isPost: page.startsWith('Blogs/'), sourceKind: /RecommendationLetter|referal3rd/.test(page) ? 'template' : 'article' };
  });
  const paths = new Set();
  for (const entry of entries) {
    if (paths.has(entry.path)) throw new Error(`Duplicate canonical path: ${entry.path}`);
    paths.add(entry.path);
  }
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}
module.exports = { root, articlesRoot, profile, seo, strip, catalog };
