let bootstrap = null;
try {
  const element = typeof document !== 'undefined' && document.getElementById('blog-bootstrap');
  if (element) bootstrap = JSON.parse(element.textContent);
} catch {
  // Client-side Markdown loading remains available when no static data is present.
}
export default bootstrap;
