import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-brace-pack-'));
let tarball;

try {
  const packed = spawnSync('npm', ['pack', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024
  });
  assert.equal(packed.status, 0, packed.stderr);
  const packResult = JSON.parse(packed.stdout)[0];
  tarball = path.join(root, packResult.filename);
  const paths = packResult.files.map((file) => file.path);

  assert.equal(paths.some((file) => file.startsWith('test/')), false);
  assert.equal(paths.some((file) => file.startsWith('scripts/')), false);
  assert.equal(paths.includes('LICENSE'), true);
  assert.equal(paths.includes('LICENSES/ACE-BSD-3-Clause.txt'), true);
  assert.equal(paths.includes('NOTICE'), true);
  assert.equal(paths.includes('index.d.ts'), true);
  assert.equal(paths.includes('mode/javascript.js'), true);
  assert.equal(paths.includes('mode/lean.js'), true);
  assert.equal(paths.includes('worker/javascript.js'), true);

  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/brace': `file:${tarball}`
    }
  }));

  const installed = spawnSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], {
    cwd: temporary,
    encoding: 'utf8'
  });
  assert.equal(installed.status, 0, installed.stderr);

  const commonjs = spawnSync(process.execPath, ['--input-type=commonjs', '-e', [
    "const direct = require('@stackline/brace');",
    "require('@stackline/brace/mode/javascript');",
    "require('@stackline/brace/mode/lean');",
    "require('@stackline/brace/theme/monokai');",
    "if (direct.version !== '1.44.0') process.exit(1);",
    "if (typeof direct.acequire('ace/mode/javascript').Mode !== 'function') process.exit(1);",
    "if (typeof direct.acequire('ace/mode/lean').Mode !== 'function') process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' });
  assert.equal(commonjs.status, 0, commonjs.stderr);

  const esm = spawnSync(process.execPath, ['--input-type=module', '-e', [
    "import brace, { acequire, version } from '@stackline/brace';",
    "if (brace.version !== version || acequire !== brace.acequire) process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' });
  assert.equal(esm.status, 0, esm.stderr);

  const manifest = JSON.parse(await readFile(path.join(
    temporary,
    'node_modules',
    '@stackline',
    'brace',
    'package.json'
  ), 'utf8'));
  assert.equal(manifest.name, '@stackline/brace');
  assert.equal(manifest.version, '1.0.2');
  assert.equal(manifest.dependencies, undefined);
} finally {
  if (tarball) await rm(tarball, { force: true });
  await rm(temporary, { force: true, recursive: true });
}

console.log('Packed scoped, deep-import, CommonJS, ESM, and license checks passed.');
