import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const registryArgument = process.argv.find((value) => value.startsWith('--registry='));
const registry = registryArgument
  ? registryArgument.slice('--registry='.length)
  : process.env.STACKLINE_REGISTRY || 'http://127.0.0.1:4873';
const version = process.env.STACKLINE_VERSION || '1.0.2';
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-brace-registry-'));

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/brace': version,
      brace: `npm:@stackline/brace@${version}`
    }
  }));

  const installed = spawnSync('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--registry',
    registry
  ], { cwd: temporary, encoding: 'utf8' });
  assert.equal(installed.status, 0, installed.stderr);

  const checked = spawnSync(process.execPath, ['-e', [
    "const direct = require('@stackline/brace');",
    "const alias = require('brace');",
    "require('@stackline/brace/mode/javascript');",
    "require('brace/mode/swig');",
    "require('brace/theme/monokai');",
    "if (direct.version !== '1.44.0' || alias.version !== direct.version) process.exit(1);",
    "if (!direct.acequire('ace/mode/javascript').Mode) process.exit(1);",
    "if (!alias.acequire('ace/mode/swig').Mode) process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr);
} finally {
  await rm(temporary, { force: true, recursive: true });
}

console.log(`Registry direct and brace-alias checks passed against ${registry}.`);
