// Shared by the browser, static publisher, and legacy-link redirect endpoint.
const normalizePage = (page = '') => String(page).replace(/^\.\//, '').replace(/\.md$/i, '');
const slug = (value) => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
const pagePath = (page = 'About') => {
  const normalized = normalizePage(page);
  const aliases = { About: '/', Work: '/work/', Blog: '/writing/', 'Projects/Project': '/projects/', TechStack: '/technical-background/', Links: '/links/', Ask: '/ask/', 404: '/404.html', config: '/config/', Markdown: '/markdown/', MarkDown: '/markdown/' };
  if (aliases[normalized]) return aliases[normalized];
  const segments = normalized.split('/');
  const prefix = segments[0] === 'Blogs' ? 'blog' : segments[0] === 'Projects' ? 'projects' : 'pages';
  const rest = prefix === 'pages' ? segments : segments.slice(1);
  return `/${prefix}/${rest.map(slug).join('/')}/`;
};
const canonicalHref = (href = '') => {
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return href;
  if (/^\/?\?/.test(href)) {
    const url = new URL(href, 'https://blog.invalid');
    const page = url.searchParams.get('page');
    return page ? pagePath(page) + url.hash : href;
  }
  if (!href.startsWith('/') && !/\.(png|svg|jpg|jpeg|gif|pdf)$/i.test(href)) return pagePath(href);
  return href;
};
module.exports = { normalizePage, pagePath, canonicalHref };
