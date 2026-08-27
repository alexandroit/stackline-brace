# @stackline/brace

[![npm version](https://img.shields.io/npm/v/@stackline/brace.svg)](https://www.npmjs.com/package/@stackline/brace)
[![npm downloads](https://img.shields.io/npm/dm/@stackline/brace.svg)](https://www.npmjs.com/package/@stackline/brace)
[![CI](https://github.com/alexandroit/stackline-brace/actions/workflows/ci.yml/badge.svg)](https://github.com/alexandroit/stackline-brace/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@stackline/brace.svg)](LICENSE)

A compatibility-first Browserify build of the modern Ace Editor. It preserves Brace deep imports, embeds workers for browser bundles, supports TypeScript 3.9, and has zero runtime dependencies.

## Install

Use the scoped package directly:

```bash
npm install @stackline/brace
```

Or replace `brace` without changing existing source imports:

```bash
npm install brace@npm:@stackline/brace@^1.0.0
```

## Existing Brace code

```js
const ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');

const editor = ace.edit('editor');
editor.session.setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');
```

## Scoped imports

```js
const ace = require('@stackline/brace');
require('@stackline/brace/mode/typescript');
require('@stackline/brace/theme/github');

const editor = ace.edit('editor');
editor.session.setMode('ace/mode/typescript');
editor.setTheme('ace/theme/github');
```

ES modules are supported at the root:

```js
import ace from '@stackline/brace';
import '@stackline/brace/mode/javascript.js';
import '@stackline/brace/theme/monokai.js';
```

## What is preserved

| Contract | Status |
| --- | --- |
| `brace@0.11.1` root API | Preserved |
| Historical mode, theme, extension, keybinding, snippet, and worker paths | Preserved |
| `acequire` loader | Preserved, with `require` also available |
| Browserify side-effect imports | Preserved |
| npm alias installation as `brace` | Tested from each registry |
| TypeScript 3.9 | Tested |
| Runtime dependencies | Zero |

The generated runtime uses `ace-builds@1.44.0` and includes 206 modes, 48 themes, 29 extensions, 206 snippet paths, and 10 inline workers. These counts are generated from the pinned build input rather than maintained by hand.

## Inline workers

Modes register their referenced worker source as a Blob URL when loaded in a browser. This prevents the common `worker-javascript.js` 404 in bundled deployments.

Consumer configuration always wins:

```js
const ace = require('@stackline/brace');

ace.config.setModuleUrl(
  'ace/mode/javascript_worker',
  'https://cdn.example.com/worker-javascript.js'
);

require('@stackline/brace/mode/javascript');
```

The package will not overwrite an existing module URL. Applications with a strict Content Security Policy can provide explicit worker URLs or disable workers through Ace's standard session API.

## Supply chain

Ace is an exact development-time generation input and is not installed for consumers. Generated assets are committed and the release records the upstream npm shasum and integrity value in `dist/build-meta.json`.

Every release gate covers:

- all paths published by `brace@0.11.1`;
- current generated inventory;
- Browserify and esbuild bundles;
- a real Chrome editor with a functioning inline worker;
- TypeScript 3.9 and current TypeScript;
- direct and npm-alias installation from the packed tarball and registries;
- package metadata, documentation, runtime audit, checksums, and SBOM.

## Documentation

- [Interactive documentation](https://alexandro.net/docs/vanilla/brace/)
- [Migration guide](MIGRATION.md)
- [Compatibility contract](COMPATIBILITY_CONTRACT.md)
- [Security policy](SECURITY.md)
- [Third-party licenses](THIRD_PARTY_LICENSES.md)
- [Changelog](CHANGELOG.md)

## Independence and attribution

`@stackline/brace` is independently maintained and is not affiliated with the original Brace or Ace maintainers.

Compatibility work derived from Brace is MIT licensed. Bundled Ace code remains BSD-3-Clause licensed. Both copyright notices and complete license texts are included in the package. See [NOTICE](NOTICE) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
