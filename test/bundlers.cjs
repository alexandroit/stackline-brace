'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..');
const output = path.join(__dirname, '.tmp');
const entry = path.join(__dirname, 'browser', 'entry.cjs');

fs.rmSync(output, { force: true, recursive: true });
fs.mkdirSync(output, { recursive: true });

(async () => {
  const esbuildResult = await esbuild.build({
    bundle: true,
    entryPoints: [entry],
    format: 'iife',
    outfile: path.join(output, 'esbuild.js'),
    platform: 'browser',
    write: true
  });
  assert.equal(esbuildResult.errors.length, 0);
  assert.equal(fs.statSync(path.join(output, 'esbuild.js')).size > 500_000, true);

  const source = fs.readFileSync(path.join(output, 'esbuild.js'));
  assert.match(source.toString('utf8'), /JavaScriptWorker/);
  fs.writeFileSync(path.join(root, 'test', 'browser', 'bundle.js'), source);
  console.log(JSON.stringify({ esbuildBytes: source.length, inlineWorker: true }));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
