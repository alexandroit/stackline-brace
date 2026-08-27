'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const browserify = require('browserify');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..');
const output = path.join(__dirname, '.tmp');
const entry = path.join(__dirname, 'browser', 'entry.cjs');

fs.rmSync(output, { force: true, recursive: true });
fs.mkdirSync(output, { recursive: true });

function bundleBrowserify() {
  return new Promise((resolve, reject) => {
    browserify(entry, { debug: false }).bundle((error, buffer) => {
      if (error) return reject(error);
      fs.writeFileSync(path.join(output, 'browserify.js'), buffer);
      resolve(buffer);
    });
  });
}

(async () => {
  const browserifyOutput = await bundleBrowserify();
  assert.equal(browserifyOutput.length > 500_000, true);
  assert.match(browserifyOutput.toString('utf8'), /JavaScriptWorker/);

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

  const source = fs.readFileSync(path.join(output, 'browserify.js'));
  fs.writeFileSync(path.join(root, 'test', 'browser', 'bundle.js'), source);
  console.log(JSON.stringify({ browserifyBytes: browserifyOutput.length, esbuildBytes: fs.statSync(path.join(output, 'esbuild.js')).size }));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
