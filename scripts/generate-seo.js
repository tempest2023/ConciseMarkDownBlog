'use strict';
const fs = require('fs');
const path = require('path');
const { catalog, root, articlesRoot, profile, seo } = require('./content-lib');
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let entries = catalog();
const posts = entries.filter(entry => entry.isPost).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
const featured = profile.featuredWriting.map(page => entries.find(entry => entry.page === page)).filter(Boolean);
const categories = [...new Set(posts.map(entry => entry.category))].sort();
const writing = '# Writing\n\nNotes on agents, research, engineering, and the things I learn while building.\n\n## Start here\n\n' +
featured.map(entry => '### [' + entry.title + '](' + entry.path + ')\n\n' + entry.description).join('\n\n') +
'\n\n## All writing\n\n' + categories.map(category => '### ' + category + '\n\n' + posts.filter(entry => entry.category === category).map(entry => '- [' + entry.title + '](' + entry.path + ') — ' + entry.publishedAt.slice(0, 10)).join('\n')).join('\n\n') +
'\n\n[Subscribe via RSS](/rss.xml)\n';
fs.writeFileSync(path.join(articlesRoot, 'Blog.md'), writing);
entries = catalog();
fs.writeFileSync(path.join(root, 'src/data/articles.json'), JSON.stringify(entries, null, 2) + '\n');
const base = seo.siteUrl.replace(/\/$/, '');
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
entries.map(entry => '  <url><loc>' + escape(base + entry.path) + '</loc><lastmod>' + entry.updatedAt + '</lastmod></url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(root, 'public/rss.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>' + escape(seo.siteName) + '</title><link>' + base + '/</link><description>' + escape(seo.defaultDescription) + '</description><language>' + seo.language + '</language><atom:link href="' + base + '/rss.xml" rel="self" type="application/rss+xml"/>\n' +
posts.map(entry => '<item><title>' + escape(entry.title) + '</title><link>' + escape(base + entry.path) + '</link><guid isPermaLink="true">' + escape(base + entry.path) + '</guid><pubDate>' + new Date(entry.publishedAt).toUTCString() + '</pubDate><description>' + escape(entry.description) + '</description></item>').join('\n') + '\n</channel></rss>\n');
console.log('Generated writing index, public catalog, sitemap and RSS for ' + entries.length + ' pages.');
