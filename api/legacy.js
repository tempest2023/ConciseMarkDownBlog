const articles = require('../src/data/articles.json');
const { normalizePage } = require('../src/util/routes');

// Old shared links receive an HTTP redirect, so even non-JS readers reach the article.
module.exports = function handler(req, res) {
  const url = new URL(req.url, 'https://blog.invalid');
  const page = normalizePage(url.searchParams.get('page') || '');
  const entry = articles.find(article => article.page.toLowerCase() === page.toLowerCase());
  if (entry) {
    res.setHeader('Location', entry.path);
    res.statusCode = 308;
    return res.end();
  }
  if (['markdown', 'config'].includes(page.toLowerCase())) {
    res.setHeader('Location', `/${page.toLowerCase()}/`);
    res.statusCode = 307;
    return res.end();
  }
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<!doctype html><title>Page not found</title><h1>Page not found</h1><p><a href="/writing/">Browse all writing</a></p>');
};
