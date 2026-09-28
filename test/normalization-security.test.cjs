'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const normalize = require('../scripts/normalize-module-path.cjs');
const brace = require('../');

// Independent bounded reference copied from the pinned Ace 1.44.0 loader.
function upstream(path) {
  let previous;
  while (path.indexOf('.') !== -1 && previous !== path) {
    previous = path;
    path = path.replace(/\/\.\//, '/').replace(/[^/]+\/\.\.\//, '');
  }
  return path;
}

test('relative normalization preserves the ordered Ace rewrite semantics', () => {
  let comparisons = 0;
  function compare(parts, remaining) {
    const path = parts.join('/');
    assert.equal(normalize(path), upstream(path), JSON.stringify(path));
    comparisons++;
    if (remaining) {
      for (const part of ['', 'a', '.', '..', '...']) compare(parts.concat(part), remaining - 1);
    }
  }
  compare([], 7);
  assert.equal(comparisons, 97656);
  assert.equal(normalize('a/../././b'), './b');
});

test('relative and plugin requires resolve the historical module identities', () => {
  const value = { compatibility: true };
  brace.define('security/value', [], () => value);
  brace.define('security/entry', ['require'], (load) => load('./folder/../value'));
  brace.define('security/plugin!security/value', [], () => value);
  brace.define('security/plugin-entry', ['require'], (load) => load('./plugin!./value'));
  assert.equal(brace.require('security/entry'), value);
  assert.equal(brace.require('security/plugin-entry'), value);
});

test('public requires handle adversarial relative paths within a bounded process', () => {
  const script = `
    const assert = require('node:assert/strict');
    const editor = require(${JSON.stringify(require.resolve('../'))});
    assert.equal(editor.require('.'.repeat(200000)), undefined);
    assert.equal(editor.require('./' + 'a/.././'.repeat(50000) + 'missing'), undefined);
  `;
  const child = spawnSync(process.execPath, ['-e', script], { timeout: 5000, encoding: 'utf8' });
  assert.ifError(child.error);
  assert.equal(child.status, 0, child.stderr);
});
