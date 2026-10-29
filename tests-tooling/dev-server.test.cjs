const assert = require('node:assert/strict');
const { test } = require('node:test');

process.env.NODE_ENV = 'development';
const createConfig = require('../config/webpackDevServer.config');
const paths = require('../config/paths');

test('development server keeps host checks and does not allow cross-origin reads', () => {
  const config = createConfig(undefined, 'localhost');
  assert.deepEqual(config.allowedHosts, ['localhost']);
  assert.equal(config.headers, undefined);
  assert.equal(createConfig(undefined).allowedHosts, 'auto');
  assert.equal(config.devMiddleware.publicPath, paths.publicUrlOrPath);
  assert.ok(config.devMiddleware.publicPath.endsWith('/'));
});

test('middleware migration preserves source maps before fallback and service worker reset', () => {
  const config = createConfig();
  const registered = [];
  const existing = { name: 'built-in' };
  const middlewares = [existing];
  const result = config.setupMiddlewares(middlewares, {
    app: { use: middleware => registered.push(middleware) },
  });
  assert.equal(registered.length, 1);
  assert.equal(typeof registered[0], 'function');
  assert.equal(result, middlewares);
  assert.equal(result[0], existing);
  assert.equal(result.length, 3);
  assert.equal(typeof result[1], 'function');
  assert.equal(typeof result[2], 'function');
});

test('server configuration supports HTTP and automatic HTTPS certificates', () => {
  const previous = process.env.HTTPS;
  try {
    process.env.HTTPS = 'false';
    assert.equal(createConfig().server, 'http');
    process.env.HTTPS = 'true';
    assert.deepEqual(createConfig().server, { type: 'https', options: {} });
  } finally {
    if (previous === undefined) delete process.env.HTTPS;
    else process.env.HTTPS = previous;
  }
});

test('SockJS retains its CommonJS UUID v4 API after the security resolution', () => {
  const { createRequire } = require('node:module');
  const sockjsRequire = createRequire(require.resolve('sockjs'));
  const uuid = sockjsRequire('uuid');
  assert.ok(uuid.validate(uuid.v4()));
});
