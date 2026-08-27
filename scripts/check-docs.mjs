import { readFile, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site-dist/', import.meta.url);
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const inventory = JSON.parse(await readFile(new URL('dist/inventory.json', root), 'utf8'));
const metadata = JSON.parse(await readFile(new URL('package-meta.json', site), 'utf8'));
const html = await readFile(new URL('index.html', site), 'utf8');
const app = await readFile(new URL('app.js', site), 'utf8');
const robots = await readFile(new URL('robots.txt', site), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', site), 'utf8');
const llms = await readFile(new URL('llms.txt', site), 'utf8');
const llmsFull = await readFile(new URL('llms-full.txt', site), 'utf8');
const migration = await readFile(new URL('guides/migration.md', site), 'utf8');
const bundle = await stat(new URL('brace-docs.js', site));

assert(metadata.name === packageJson.name, 'documentation package name is stale');
assert(metadata.version === packageJson.version, 'documentation package version is stale');
assert(metadata.aceVersion === inventory.aceVersion, 'Ace version is stale');
assert(metadata.modes === inventory.modes.length, 'mode inventory is stale');
assert(metadata.themes === inventory.themes.length, 'theme inventory is stale');
assert(metadata.workers === inventory.workers.length, 'worker inventory is stale');
assert(metadata.runtimeDependencies === 0, 'runtime dependency count is stale');
assert(!html.includes('{{'), 'HTML contains an unresolved placeholder');
assert(!app.includes('{{'), 'application contains an unresolved placeholder');
assert(html.includes('<link rel="canonical" href="https://alexandro.net/docs/vanilla/brace/">'), 'canonical URL is missing');
assert(html.includes('SoftwareSourceCode'), 'structured software metadata is missing');
assert(html.includes('index,follow'), 'indexable robots metadata is missing');
assert(html.includes('id="editor"'), 'interactive editor is missing');
assert(html.includes('id="language"'), 'language control is missing');
assert(app.startsWith("'use strict';"), 'documentation app must start in strict mode');
assert(app.includes("brace.edit('editor')"), 'Ace editor initialization is missing');
assert(robots.includes('User-agent: *\nAllow: /'), 'robots policy is not open');
assert(count(sitemap, '/brace/') === 6, 'sitemap must expose exactly six package URLs');
assert(llms.includes('npm install @stackline/brace'), 'LLM direct install reference is missing');
assert(llmsFull.includes('real Chrome editor and worker'), 'LLM verification evidence is missing');
assert(migration.includes('brace@npm:@stackline/brace'), 'npm alias guide is missing');
assert(bundle.size > 500_000 && bundle.size < 4_000_000, `documentation bundle size is invalid: ${bundle.size}`);

for (const [name, value] of Object.entries({ html, llms, llmsFull, migration })) {
  assert(!/(127\.0\.0\.1|localhost|verdaccio)/i.test(value), `${name} exposes a private environment`);
}

console.log(JSON.stringify({ bundleBytes: bundle.size, name: metadata.name, version: metadata.version }));

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
