import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { JSDOM } = require('jsdom');
const entries = require('../src/data/articles.json');
const { root, articlesRoot, seo } = require('./content-lib');
const legacy = require('../api/legacy');
let links = 0;
const failures = [];
for (const entry of entries) {
  const file = path.join(root, 'build', entry.path, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const document = new JSDOM(html).window.document;
  const article = document.querySelector('article');
  assert.ok(article?.textContent.trim().length > 40, `${entry.page}: missing readable article`);
  assert.ok(document.querySelector('h1'), `${entry.page}: missing heading`);
  assert.equal(document.querySelector('link[rel="canonical"]').href, seo.siteUrl + entry.path);
  assert.equal(document.querySelector('meta[name="robots"]').content.includes('noindex'), false);
  const bootstrap = JSON.parse(document.querySelector('#blog-bootstrap').textContent);
  assert.equal(bootstrap.markdown, fs.readFileSync(path.join(articlesRoot, entry.page + '.md'), 'utf8'), `${entry.page}: source mismatch`);
  const structured = JSON.parse(document.querySelector('#seo-structured-data').textContent);
  if (entry.isPost) {
    assert.equal(structured['@graph'][1]['@type'], 'BlogPosting');
    assert.equal(structured['@graph'][1].datePublished, entry.publishedAt);
    assert.ok(document.querySelectorAll('time').length >= 2);
  }
  for (const anchor of document.querySelectorAll('a[href^="/"]')) {
    links++;
    const url = new URL(anchor.getAttribute('href'), seo.siteUrl);
    if (url.searchParams.has('page')) failures.push(`${entry.page}: noncanonical ${url.pathname + url.search}`);
    if (url.pathname.startsWith('/api/')) continue;
    const destination = path.join(root, 'build', decodeURIComponent(url.pathname));
    if (!fs.existsSync(destination)) failures.push(`${entry.page}: missing ${url.pathname}`);
  }
  for (const image of document.querySelectorAll('img[src^="/"]')) {
    if (!fs.existsSync(path.join(root, 'build', decodeURIComponent(image.getAttribute('src'))))) failures.push(`${entry.page}: missing image ${image.getAttribute('src')}`);
  }
  for (const suffix of ['', '.md']) {
    const response = { setHeader(name, value) { this[name] = value; }, end() {} };
    legacy({ url: '/?page=' + encodeURIComponent(entry.page + suffix) }, response);
    assert.equal(response.statusCode, 308);
    assert.equal(response.Location, entry.path);
  }
}
const writing = new JSDOM(fs.readFileSync(path.join(root, 'build/writing/index.html'), 'utf8')).window.document;
for (const entry of entries.filter(item => item.isPost)) assert.ok([...writing.querySelectorAll('a')].some(a => a.getAttribute('href') === entry.path), `Writing index omits ${entry.page}`);
const notFound = { setHeader() {}, end() {} };
legacy({ url: '/?page=does-not-exist' }, notFound);
assert.equal(notFound.statusCode, 404);
const notFoundDocument = new JSDOM(fs.readFileSync(path.join(root, 'build/404.html'), 'utf8')).window.document;
assert.equal(notFoundDocument.querySelector('meta[name="robots"]').content, 'noindex, follow');
assert.equal(JSON.parse(notFoundDocument.querySelector('#blog-bootstrap').textContent).noIndex, true);
assert.deepEqual(failures, [], failures.join('\n'));
console.log(`Verified ${entries.length} pages without JavaScript, ${links} local links, source completeness, metadata, writing discovery, legacy redirects and 404 metadata.`);
