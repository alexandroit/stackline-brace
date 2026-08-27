import { cp, mkdir, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const browserify = require('browserify');
const root = new URL('../', import.meta.url);
const output = new URL('../site-dist/', import.meta.url);
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const inventory = JSON.parse(await readFile(new URL('dist/inventory.json', root), 'utf8'));

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });
await cp(new URL('docs-site/', root), output, { recursive: true });
await unlink(new URL('editor-entry.cjs', output));
await mkdir(new URL('guides/', output), { recursive: true });
await mkdir(new URL('examples/', output), { recursive: true });
await cp(new URL('MIGRATION.md', root), new URL('guides/migration.md', output));
await cp(new URL('COMPATIBILITY_CONTRACT.md', root), new URL('guides/compatibility.md', output));
await cp(new URL('THIRD_PARTY_LICENSES.md', root), new URL('guides/third-party-licenses.md', output));
await cp(new URL('examples/commonjs.cjs', root), new URL('examples/commonjs.cjs', output));
await cp(new URL('examples/esm.mjs', root), new URL('examples/esm.mjs', output));

const bundle = await new Promise((resolve, reject) => {
  browserify(new URL('docs-site/editor-entry.cjs', root).pathname).bundle((error, buffer) => {
    if (error) reject(error);
    else resolve(buffer);
  });
});
await writeFile(new URL('brace-docs.js', output), bundle);

const replacements = {
  '{{ACE_VERSION}}': inventory.aceVersion,
  '{{EXTENSION_COUNT}}': String(inventory.extensions.length),
  '{{MODE_COUNT}}': String(inventory.modes.length),
  '{{PACKAGE_VERSION}}': packageJson.version,
  '{{SNIPPET_COUNT}}': String(inventory.snippets.length),
  '{{THEME_COUNT}}': String(inventory.themes.length),
  '{{WORKER_COUNT}}': String(inventory.workers.length)
};

for (const file of ['index.html', 'app.js', 'llms.txt', 'llms-full.txt']) {
  const fileUrl = new URL(file, output);
  let source = await readFile(fileUrl, 'utf8');
  for (const [placeholder, value] of Object.entries(replacements)) {
    source = source.split(placeholder).join(value);
  }
  await writeFile(fileUrl, source, 'utf8');
}

await writeFile(new URL('package-meta.json', output), `${JSON.stringify({
  aceVersion: inventory.aceVersion,
  extensions: inventory.extensions.length,
  modes: inventory.modes.length,
  name: packageJson.name,
  runtimeDependencies: Object.keys(packageJson.dependencies || {}).length,
  snippets: inventory.snippets.length,
  themes: inventory.themes.length,
  version: packageJson.version,
  workers: inventory.workers.length
}, null, 2)}\n`, 'utf8');

console.log(`Documentation built for ${packageJson.name}@${packageJson.version}.`);
