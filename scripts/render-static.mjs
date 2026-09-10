import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import markdownPolicy from '../src/util/markdown-policy.js';
const require = createRequire(import.meta.url);
const { root, articlesRoot, profile, seo } = require('./content-lib');
const entries = require('../src/data/articles.json');
const { canonicalHref } = require('../src/util/routes');
const { transformSync } = require('@babel/core');
// Honor the existing JS configuration without adding a second settings file.
const configSource = transformSync(fs.readFileSync(path.join(root, 'src/config.js'), 'utf8'), { configFile: false, babelrc: false, plugins: ['@babel/plugin-transform-modules-commonjs'] }).code;
const configModule = { exports: {} };
new Function('module', 'exports', 'require', configSource)(configModule, configModule.exports, createRequire(path.join(root, 'src/config.js')));
const config = configModule.exports.default;
const output = path.join(root, 'build');
const shell = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const assets = [...shell.matchAll(/<script\b[^>]*src=[^>]*><\/script>|<link\b[^>]*rel="stylesheet"[^>]*>/g)].map(match => match[0].replace(/(["'])\.\//g, '$1/')).join('');
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const base = seo.siteUrl.replace(/\/$/, '');
const markdownHTML = markdown => renderToStaticMarkup(React.createElement(ReactMarkdown, { children: markdown, remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeRaw, rehypeKatex, markdownPolicy] }));
const nav = config.headers.map(item => ({ label: item.title, href: /^https?:/.test(item.customUrl || '') ? item.customUrl : canonicalHref(`/?page=${encodeURIComponent(item.customUrl || item.title)}`) }));

function documentFor(entry, markdown, { noindex = false, utility = false } = {}) {
  const canonical = base + entry.path;
  const title = entry.path === '/' ? `${profile.name} — ${profile.role}` : `${entry.title} | ${seo.siteName}`;
  const description = entry.path === '/' ? profile.intro : entry.description;
  const body = markdownHTML(markdown);
  const hasTitle = /<h1\b/.test(body);
  const dates = entry.isPost ? `<div class="article-meta"><span>${escape(seo.author)}</span><span>Published <time datetime="${entry.publishedAt}">${entry.publishedAt.slice(0, 10)}</time></span><span>Updated <time datetime="${entry.updatedAt}">${entry.updatedAt.slice(0, 10)}</time></span><span>${entry.readingMinutes} min read</span></div>` : '';
  const structured = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Person', '@id': `${base}/#person`, name: profile.name, alternateName: profile.alias, url: base, sameAs: [profile.contact.github, profile.contact.linkedin] },
    { '@type': entry.isPost ? 'BlogPosting' : entry.path === '/' ? 'ProfilePage' : 'WebPage', '@id': `${canonical}#page`, url: canonical, name: entry.title, headline: entry.title, description, author: { '@id': `${base}/#person` }, datePublished: entry.isPost ? entry.publishedAt : undefined, dateModified: entry.updatedAt, mainEntity: entry.path === '/' ? { '@id': `${base}/#person` } : undefined, inLanguage: seo.language }
  ] };
  return `<!doctype html><html lang="${seo.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="author" content="${escape(seo.author)}"><meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}"><link rel="canonical" href="${escape(canonical)}"><link rel="icon" href="/favicon.ico"><link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml"><meta property="og:type" content="${entry.isPost ? 'article' : 'website'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(new URL(seo.defaultImage, base).href)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(new URL(seo.defaultImage, base).href)}"><script id="seo-structured-data" type="application/ld+json">${json(noindex ? {} : structured)}</script>${assets}<noscript><style>.site-nav{display:flex;position:static;flex-wrap:wrap}.site-header{flex-wrap:wrap}.header-controls{flex-wrap:wrap}</style></noscript></head><body><div id="root"><div class="page"><a class="skip-link" href="#main-content">Skip to content</a><header class="site-header"><a class="site-brand" href="/">${escape(config.title)}</a><nav class="site-nav" aria-label="Main navigation">${nav.map(item => `<a href="${escape(item.href)}"${entry.path === item.href ? ' aria-current="page"' : ''}>${escape(item.label)}</a>`).join('')}</nav></header><main id="main-content" class="main-container"><article class="article-content">${dates}${!hasTitle ? `<h1>${escape(entry.title)}</h1>` : ''}${body}</article></main><footer class="static-footer"><a href="mailto:${escape(config.email)}">Email</a><a href="${escape(config.resume_url)}">Résumé</a><a href="${escape(config.social.github)}">GitHub</a><a href="${escape(config.social.linkedin)}">LinkedIn</a><div class="static-colophon"><p>A small space<br>for unfinished thoughts<br>and things worth sharing.</p><span>— Tempest</span><a href="${escape(config.repo)}">Made of Markdown ↗</a></div><a href="/rss.xml">RSS</a><p>© ${new Date().getFullYear()} ${escape(config.name)}</p></footer></div></div><script id="blog-bootstrap" type="application/json">${json({ page: entry.page, markdown: utility ? '' : markdown, noIndex: noindex })}</script></body></html>`;
}
for (const entry of entries) {
  const markdown = fs.readFileSync(path.join(articlesRoot, entry.page + '.md'), 'utf8');
  const destination = path.join(output, entry.path, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, documentFor(entry, markdown));
  const raw = path.join(output, 'content', entry.page + '.md');
  fs.mkdirSync(path.dirname(raw), { recursive: true });
  fs.writeFileSync(raw, markdown);
}
for (const [page, url, title] of [['Markdown', '/markdown/', 'Markdown editor'], ['config', '/config/', 'Local configuration']]) {
  const dir = path.join(output, url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), documentFor({ page, path: url, title, description: title }, '# ' + title + '\n\nThis tool needs JavaScript. [Return to writing](/writing/).', { noindex: true, utility: true }));
}
fs.writeFileSync(path.join(output, '404.html'), documentFor({ page: '404', path: '/404.html', title: 'Page not found', description: 'This page could not be found.' }, '# Page not found\n\n[Browse all writing](/writing/) or [return home](/).', { noindex: true }));
fs.writeFileSync(path.join(output, 'articles.json'), JSON.stringify(entries));
console.log(`Published ${entries.length} complete HTML pages and their Markdown sources.`);
