const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');
const { test } = require('node:test');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

process.env.NODE_ENV = 'development';
const createConfig = require('../config/webpackDevServer.config');
const paths = require('../config/paths');

function request (server, secure, headers = {}, requestPath = '/manifest.json') {
  return new Promise((resolve, reject) => {
    const client = secure ? https : http;
    client.get({
      hostname: '127.0.0.1', port: server.server.address().port,
      path: requestPath, headers, rejectUnauthorized: false,
    }, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
    }).on('error', reject);
  });
}

for (const secure of [false, true]) {
  test(`development server serves ${secure ? 'HTTPS with generated certificate' : 'HTTP'} and rejects foreign hosts`, { timeout: 30000 }, async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-dev-server-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const proxySetup = path.join(directory, 'setupProxy.cjs');
    await fs.writeFile(proxySetup, `module.exports = app => {
      app.get('/custom-api', (req, res) => res.json({ customHandler: true }));
    };`);
    const originalProxySetup = paths.proxySetup;
    paths.proxySetup = proxySetup;
    t.after(() => { paths.proxySetup = originalProxySetup; });
    const entry = path.join(directory, 'entry.js');
    await fs.writeFile(entry, 'console.log("development fixture");');
    const compiler = webpack({
      mode: 'development', entry,
      output: { path: path.join(directory, 'dist'), filename: 'fixture.js' },
      infrastructureLogging: { level: 'error' },
    });
    const config = createConfig(undefined, 'localhost');
    const server = new WebpackDevServer({
      ...config, host: '127.0.0.1', port: 0, open: false,
      server: secure ? { type: 'https', options: {} } : 'http',
      client: false, hot: false, webSocketServer: false,
      devMiddleware: { ...config.devMiddleware, stats: 'errors-only' },
    }, compiler);
    t.after(() => server.stop());
    await server.start();
    const response = await request(server, secure);
    assert.equal(response.status, 200);
    assert.ok(JSON.parse(response.body).icons);
    const foreign = await request(server, secure, { Host: 'attacker.invalid' });
    assert.equal(foreign.status, 403);
    const custom = await request(server, secure, {}, '/custom-api');
    assert.equal(custom.status, 200);
    assert.deepEqual(JSON.parse(custom.body), { customHandler: true });
    const customForeign = await request(server, secure, { Host: 'attacker.invalid' }, '/custom-api');
    assert.equal(customForeign.status, 403);
    assert.equal(customForeign.body, 'Invalid Host header');
    const customCrossSite = await request(server, secure, {
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
    }, '/custom-api');
    assert.equal(customCrossSite.status, 403);
    assert.equal(customCrossSite.body, 'Cross-Origin request blocked');
    const sourceForeign = await request(server, secure, { Host: 'attacker.invalid' }, '/__get-internal-source');
    assert.equal(sourceForeign.status, 403);
    assert.equal(sourceForeign.body, 'Invalid Host header');
    const crossOrigin = await request(server, secure, { Origin: 'https://attacker.invalid' });
    assert.equal(crossOrigin.headers['access-control-allow-origin'], undefined);
  });
}
