import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import normalizeRelativeModulePath from './normalize-module-path.cjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const aceRoot = join(root, 'node_modules', 'ace-builds');
const sourceRoot = join(aceRoot, 'src-min-noconflict');
const legacyRoot = join(root, 'vendor', 'legacy');
const generatedDirectories = ['mode', 'theme', 'ext', 'keybinding', 'snippets', 'worker', 'dist'];

const packageJson = JSON.parse(await readFile(join(aceRoot, 'package.json'), 'utf8'));
if (packageJson.version !== '1.44.0') {
  throw new Error(`Expected ace-builds 1.44.0, received ${packageJson.version}`);
}

for (const directory of generatedDirectories) {
  await rm(join(root, directory), { force: true, recursive: true });
  await mkdir(join(root, directory), { recursive: true });
}

const banner = (source) => `/* Generated from ace-builds@1.44.0 (${source}). Do not edit. */\n'use strict';\n`;

function makeBrowserifySafe(source) {
  return source
    .replace(/require/g, 'acequire')
    .replace(/(['"])acequire\1/g, '"require"')
    .replace(/emmet\.acequire/g, 'emmet.require');
}

async function write(relativePath, contents) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents.replace(/\r\n/g, '\n'), 'utf8');
}

async function listMatching(directory, expression) {
  return (await readdir(directory)).filter((name) => expression.test(name)).sort();
}

const upstreamCore = await readFile(join(aceRoot, 'src-noconflict', 'ace.js'), 'utf8');
const legacyNormalization = String.raw`        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }`;
const normalizationDeclaration = 'var normalizeModule = function(parentId, moduleName) {';
if (upstreamCore.split(legacyNormalization).length !== 2 ||
    upstreamCore.split(normalizationDeclaration).length !== 2) {
  throw new Error('Ace loader normalization changed; review the linear compatibility patch.');
}
const core = makeBrowserifySafe(upstreamCore
  .replace(legacyNormalization, '        moduleName = normalizeRelativeModulePath(moduleName);')
  .replace(normalizationDeclaration, `${normalizeRelativeModulePath.toString()}\n\n${normalizationDeclaration}`));
await write('index.js', `${core}\n/* Modern Ace alias retained alongside the Brace loader name. */\nif (module.exports && !module.exports.require) module.exports.require = module.exports.acequire;\n`);

const workerNames = (await listMatching(sourceRoot, /^worker-[a-z0-9_]+\.js$/))
  .map((name) => name.slice(7, -3))
  .filter((name) => name !== 'base');

for (const name of workerNames) {
  const source = await readFile(join(sourceRoot, `worker-${name}.js`), 'utf8');
  await write(
    `worker/${name}.js`,
    `${banner(`src-min-noconflict/worker-${name}.js`)}module.exports.id = 'ace/mode/${name}_worker';\nmodule.exports.src = ${JSON.stringify(source)};\n`
  );
}

const registerSource = await readFile(join(root, 'scripts', 'worker-register.template.cjs'), 'utf8');
await write('worker/register.js', registerSource);

const categories = [
  { directory: 'mode', prefix: 'mode-' },
  { directory: 'theme', prefix: 'theme-' },
  { directory: 'ext', prefix: 'ext-' },
  { directory: 'keybinding', prefix: 'keybinding-' }
];

const inventory = {
  aceVersion: packageJson.version,
  generatedAt: 'reproducible-build',
  modes: [],
  themes: [],
  extensions: [],
  keybindings: [],
  snippets: [],
  workers: workerNames
};

for (const category of categories) {
  const names = await listMatching(sourceRoot, new RegExp(`^${category.prefix}[a-z0-9_]+\\.js$`));
  for (const filename of names) {
    const name = filename.slice(category.prefix.length, -3);
    const source = await readFile(join(sourceRoot, filename), 'utf8');
    const usedWorkers = [...source.matchAll(/['"]ace\/mode\/([a-z0-9_]+)_worker['"]/g)]
      .map((match) => match[1])
      .filter((worker, index, all) => all.indexOf(worker) === index && workerNames.includes(worker));
    const registrations = usedWorkers.length
      ? `var registerWorker = require('../worker/register');\n${usedWorkers.map((worker) => `registerWorker(ace, require('../worker/${worker}'));`).join('\n')}\n`
      : '';
    await write(
      `${category.directory}/${name}.js`,
      `${banner(`src-min-noconflict/${filename}`)}var ace = require('../');\n${registrations}${source}\n`
    );
    const key = category.directory === 'mode'
      ? 'modes'
      : category.directory === 'theme'
        ? 'themes'
        : category.directory === 'ext'
          ? 'extensions'
          : 'keybindings';
    inventory[key].push(name);
  }
}

const snippetSourceRoot = join(sourceRoot, 'snippets');
for (const filename of await listMatching(snippetSourceRoot, /^[a-z0-9_]+\.js$/)) {
  const name = filename.slice(0, -3);
  const source = await readFile(join(snippetSourceRoot, filename), 'utf8');
  const fallback = source.includes(`ace.define("ace/snippets/${name}"`)
    ? ''
    : `ace.define('ace/snippets/${name}', ['require', 'exports', 'module'], function(require, exports) {\n  exports.snippetText = undefined;\n  exports.scope = '${name}';\n});\n`;
  await write(`snippets/${name}.js`, `${banner(`src-min-noconflict/snippets/${filename}`)}var ace = require('../');\n${fallback}${source}\n`);
  inventory.snippets.push(name);
}

async function addAlias(directory, alias, target, aceNamespace) {
  const moduleId = `ace/${aceNamespace}/${alias}`;
  const targetId = `ace/${aceNamespace}/${target}`;
  await write(
    `${directory}/${alias}.js`,
    `${banner(`legacy alias ${alias} -> ${target}`)}var ace = require('../');\nrequire('./${target}');\nace.define('${moduleId}', ['require', 'exports', 'module', '${targetId}'], function(require, exports, module) {\n  module.exports = require('${targetId}');\n});\n`
  );
  const key = directory === 'mode' ? 'modes' : 'snippets';
  if (!inventory[key].includes(alias)) inventory[key].push(alias);
}

for (const [alias, target] of Object.entries({
  bro: 'zeek',
  live_script: 'livescript',
  mavens_mate_log: 'text',
  mips_assembler: 'mips',
  mipsassembler: 'mips',
  swig: 'twig'
})) {
  await addAlias('mode', alias, target, 'mode');
  await addAlias('snippets', alias, target, 'snippets');
}

for (const name of ['lean']) {
  const source = await readFile(join(legacyRoot, 'mode', `${name}.js`), 'utf8');
  await write(`mode/${name}.js`, `${banner(`brace@0.11.1 mode/${name}.js`)}var ace = require('../');\n${source}\n`);
  inventory.modes.push(name);
}

for (const name of ['lean', 'swig']) {
  const source = await readFile(join(legacyRoot, 'snippets', `${name}.js`), 'utf8');
  await write(`snippets/${name}.js`, `${banner(`brace@0.11.1 snippets/${name}.js`)}var ace = require('../');\n${source}\n`);
  inventory.snippets.push(name);
}

for (const name of ['chromevox', 'old_ie']) {
  const source = await readFile(join(legacyRoot, 'ext', `${name}.js`), 'utf8');
  await write(`ext/${name}.js`, `${banner(`brace@0.11.1 ext/${name}.js`)}var ace = require('../');\n${source}\n`);
  if (!inventory.extensions.includes(name)) inventory.extensions.push(name);
}

for (const key of ['modes', 'themes', 'extensions', 'keybindings', 'snippets', 'workers']) {
  inventory[key] = [...new Set(inventory[key])].sort();
}

await write('dist/inventory.json', `${JSON.stringify(inventory, null, 2)}\n`);
await write('dist/build-meta.json', `${JSON.stringify({
  package: '@stackline/brace',
  version: '1.0.1',
  aceBuilds: {
    version: packageJson.version,
    npmShasum: 'd657730f665fccf72d2945d95887e12c514a29f1',
    npmIntegrity: 'sha512-PFNMSYqFdEUkul2Ntud0HvA09AgY+F1ag0UYdpMH60wNI/qOA8cB8tlTgoALMEwIdUPJK2CjrIQ7OnbiSS/ugQ=='
  },
  runtimeDependencies: 0
}, null, 2)}\n`);

console.log(`Generated ${inventory.modes.length} modes, ${inventory.themes.length} themes, ${inventory.extensions.length} extensions, ${inventory.snippets.length} snippets, and ${inventory.workers.length} workers.`);
