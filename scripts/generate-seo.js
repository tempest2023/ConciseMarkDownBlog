'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const seoConfig = require('../src/seo.config.json');

const projectRoot = path.resolve(__dirname, '..');
const articlesRoot = path.join(projectRoot, 'src', 'articles');
const publicRoot = path.join(projectRoot, 'public');
const excludedArticles = new Set(['404.md', 'markdown_intro.md']);

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const stripMarkdown = (value = '') => value
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/^[\s>*#+\-|]+/gm, '')
  .replace(/[~*_]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const getMarkdownFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? getMarkdownFiles(absolutePath) : [absolutePath];
  })
  .filter((filePath) => filePath.endsWith('.md'))
  .filter((filePath) => !excludedArticles.has(path.relative(articlesRoot, filePath).replace(/\\/g, '/')));

const getLastModified = (filePath) => {
  const relativeToProject = path.relative(projectRoot, filePath);
  try {
    const committedAt = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', relativeToProject],
      { cwd: projectRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    if (committedAt) return new Date(committedAt).toISOString();
  } catch (error) {
    // Fall back to the file timestamp when building outside a Git checkout.
  }
  return fs.statSync(filePath).mtime.toISOString();
};

const getArticleData = (filePath) => {
  const relativePath = path.relative(articlesRoot, filePath).replace(/\\/g, '/');
  const page = relativePath.replace(/\.md$/i, '');
  const markdown = fs.readFileSync(filePath, 'utf8');
  const heading = markdown.match(/^#{1,3}\s+(.+)$/m);
  const title = stripMarkdown(heading ? heading[1] : path.basename(page).replace(/[_-]+/g, ' '));
  const paragraph = markdown.split(/\n\s*\n/).find((block) => {
    const trimmed = block.trim();
    return trimmed && !/^#{1,6}\s/.test(trimmed) && !/^```/.test(trimmed) && !/^[-*+]\s/.test(trimmed) && !/^<svg/i.test(trimmed);
  });
  const description = stripMarkdown(paragraph || seoConfig.defaultDescription).slice(0, 200);
  const lastModified = getLastModified(filePath);
  const isHome = page.toLowerCase() === 'about';
  const url = isHome
    ? `${seoConfig.siteUrl.replace(/\/$/, '')}/`
    : `${seoConfig.siteUrl.replace(/\/$/, '')}/?page=${encodeURIComponent(page)}`;

  return { page, title, description, lastModified, url };
};

const articles = getMarkdownFiles(articlesRoot)
  .map(getArticleData)
  .sort((a, b) => a.url.localeCompare(b.url));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articles.map((article) => `  <url>
    <loc>${escapeXml(article.url)}</loc>
    <lastmod>${article.lastModified}</lastmod>
  </url>`).join('\n')}
</urlset>
`;

const feedArticles = articles
  .filter((article) => article.page.startsWith('Blogs/'))
  .sort((a, b) => b.lastModified.localeCompare(a.lastModified))
  .slice(0, 30);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(seoConfig.siteName)}</title>
    <link>${escapeXml(`${seoConfig.siteUrl.replace(/\/$/, '')}/`)}</link>
    <description>${escapeXml(seoConfig.defaultDescription)}</description>
    <language>${escapeXml(seoConfig.language)}</language>
    <atom:link href="${escapeXml(`${seoConfig.siteUrl.replace(/\/$/, '')}/rss.xml`)}" rel="self" type="application/rss+xml" />
${feedArticles.map((article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.url)}</link>
      <guid isPermaLink="true">${escapeXml(article.url)}</guid>
      <pubDate>${new Date(article.lastModified).toUTCString()}</pubDate>
      <description>${escapeXml(article.description)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(publicRoot, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicRoot, 'rss.xml'), rss);
console.log(`Generated sitemap.xml (${articles.length} URLs) and rss.xml (${feedArticles.length} posts).`);
