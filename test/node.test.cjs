'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

test('exports the Brace root contract on the current Ace engine', () => {
  const brace = require('..');

  assert.equal(brace.version, '1.44.0');
  assert.equal(typeof brace.edit, 'function');
  assert.equal(typeof brace.createEditSession, 'function');
  assert.equal(typeof brace.require, 'function');
  assert.equal(brace.acequire, brace.require);
  assert.equal(typeof brace.config.setModuleUrl, 'function');
});

test('creates and tokenizes a JavaScript edit session', () => {
  const brace = require('..');
  require('../mode/javascript');

  const session = brace.createEditSession('const answer = 42;', 'ace/mode/javascript');
  session.setUseWorker(false);
  const tokens = session.getTokens(0);

  assert.equal(tokens.some((token) => token.value === 'const' && token.type.includes('storage')), true);
  assert.equal(session.getMode().$id, 'ace/mode/javascript');
});

test('loads CommonJS and ESM roots without creating separate Ace instances', async () => {
  const commonjs = require('..');
  const esm = await import('../index.mjs');

  assert.equal(esm.default, commonjs);
  assert.equal(esm.edit, commonjs.edit);
  assert.equal(esm.acequire, commonjs.acequire);
  assert.equal(esm.version, commonjs.version);
});
