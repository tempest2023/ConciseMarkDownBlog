// Static preview with the same legacy redirect handler used by Vercel. No SPA fallback.
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const legacy = require('../api/legacy');
const chat = require('../api/chat');
const root = path.resolve(__dirname, '../build');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.md': 'text/markdown', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain' };
function createPreviewServer(chatHandler = chat) { return http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/chat') return chatHandler(req, res);
  if (url.pathname === '/' && url.searchParams.has('page')) return legacy(req, res);
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end(); }
  let file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { status = 404; file = path.join(root, '404.html'); }
  res.writeHead(status, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}); }
if (require.main === module) createPreviewServer().listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Blog preview: http://127.0.0.1:${process.env.PORT || 4173}`));
module.exports = { createPreviewServer };
