const { canonicalHref } = require('./routes');
const text = node => node.type === 'text' ? node.value : (node.children || []).map(text).join('');

// One HTML policy for both the static publisher and browser Markdown renderer.
function markdownPolicy () {
  return tree => {
    const ids = new Map();
    let mainHeading = false;
    function collectIds (node) {
      if (node.properties?.id) ids.set(node.properties.id, 1);
      (node.children || []).forEach(collectIds);
    }
    collectIds(tree);
    function visit (node) {
      if (node.type === 'element') {
        node.properties = node.properties || {};
        if (node.tagName === 'h1') {
          if (mainHeading) node.tagName = 'h2';
          mainHeading = true;
        }
        if (node.tagName === 'a' && node.properties.href) node.properties.href = canonicalHref(node.properties.href);
        if (node.tagName === 'img') {
          const src = node.properties.src || '';
          if (src.startsWith('/src/articles/')) node.properties.src = '/resources' + src;
          node.properties.loading = 'lazy';
          node.properties.decoding = 'async';
        }
        if (/^h[1-6]$/.test(node.tagName) && !node.properties.id) {
          const base = text(node).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
          const count = ids.get(base) || 0;
          ids.set(base, count + 1);
          node.properties.id = base + (count ? '-' + count : '');
        }
      }
      (node.children || []).forEach(visit);
    }
    visit(tree);
  };
}
module.exports = markdownPolicy;
