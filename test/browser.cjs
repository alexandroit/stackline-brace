'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');

const pagePath = path.join(__dirname, 'browser', 'index.html');
const bundle = path.join(__dirname, 'browser', 'bundle.js');
assert.equal(fs.existsSync(bundle), true, 'run the bundler test before the browser test');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
    headless: true,
    args: ['--allow-file-access-from-files', '--no-sandbox']
  });
  const errors = [];

  try {
    const page = await browser.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('requestfailed', (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    await page.goto(`file://${pagePath}`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.body.dataset.worker === 'annotated', { timeout: 10_000 });

    const state = await page.evaluate(() => ({ ...document.body.dataset }));
    assert.deepEqual(errors, []);
    assert.equal(state.editor, 'ready');
    assert.equal(state.mode, 'ace/mode/javascript');
    assert.equal(state.theme, 'ace/theme/monokai');
    assert.equal(state.version, '1.44.0');
    assert.match(state.workerUrl, /^blob:/);
    assert.equal(state.worker, 'annotated');
    assert.match(state.annotationCount, /^[1-9][0-9]*$/);
  } finally {
    await browser.close();
    fs.rmSync(bundle, { force: true });
  }

  console.log('Real Chrome editor, theme, mode, and inline worker checks passed.');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
