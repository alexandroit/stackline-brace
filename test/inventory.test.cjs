'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const inventory = require('../dist/inventory.json');

const categories = {
  extensions: 'ext',
  keybindings: 'keybinding',
  modes: 'mode',
  snippets: 'snippets',
  themes: 'theme',
  workers: 'worker'
};

test('records the pinned generation source and every generated path', () => {
  assert.equal(inventory.aceVersion, '1.44.0');
  assert.equal(inventory.generatedAt, 'reproducible-build');

  for (const [key, directory] of Object.entries(categories)) {
    assert.equal(inventory[key].length > 0, true, `${key} inventory is empty`);
    for (const name of inventory[key]) {
      assert.equal(fs.existsSync(path.join(root, directory, `${name}.js`)), true, `${directory}/${name}.js is missing`);
    }
  }
});

test('does not expose runtime dependencies', () => {
  const manifest = require('../package.json');
  const buildMeta = require('../dist/build-meta.json');

  assert.equal(manifest.dependencies, undefined);
  assert.equal(buildMeta.runtimeDependencies, 0);
  assert.equal(buildMeta.aceBuilds.version, '1.44.0');
  assert.match(buildMeta.aceBuilds.npmIntegrity, /^sha512-/);
});
