'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const brace = require('..');
const legacy = require('./fixtures/brace-0.11.1-inventory.json');

test('loads every JavaScript path published by brace 0.11.1', () => {
  for (const [directory, names] of Object.entries(legacy)) {
    for (const name of names) {
      const resolved = require.resolve(path.join('..', directory, name));
      assert.equal(typeof resolved, 'string');
      require(resolved);
    }
  }
});

test('registers historical mode and snippet module identifiers', () => {
  for (const name of legacy.mode) {
    require(path.join('..', 'mode', name));
    assert.equal(typeof brace.acequire(`ace/mode/${name}`).Mode, 'function', `ace/mode/${name} is unavailable`);
  }

  for (const name of legacy.snippets) {
    require(path.join('..', 'snippets', name));
    assert.notEqual(brace.acequire(`ace/snippets/${name}`), undefined, `ace/snippets/${name} is unavailable`);
  }
});
