# @stackline/brace

> Compatibility-first Browserify build of the modern Ace editor with inline workers

[![npm version](https://img.shields.io/npm/v/@stackline/brace.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/brace)
[![license](https://img.shields.io/npm/l/@stackline/brace.svg?style=flat-square)](https://github.com/alexandroit/stackline-brace/blob/main/LICENSE)
[![GitHub repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-brace)

**[Documentation](https://alexandro.net/docs/vanilla/brace/)** |
**[npm](https://www.npmjs.com/package/@stackline/brace)** |
**[Issues](https://github.com/alexandroit/stackline-brace/issues)** |
**[Repository](https://github.com/alexandroit/stackline-brace)**

**Package version:** `1.0.2`

## Why this package?

A compatibility-first Browserify build of the modern Ace Editor. It preserves Brace deep imports, embeds workers for browser bundles, supports TypeScript 3.9, and has zero runtime dependencies.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/brace@1.0.2` |
| Node.js runtime | `>=12` |
| CommonJS / primary entry | `./index.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./index.d.ts` |

## Installation

<a id="install"></a>

### Install

Use the scoped package directly:

```bash
npm install @stackline/brace
```

Or replace `brace` without changing existing source imports:

```bash
npm install brace@npm:@stackline/brace@^1.0.2
```

## Usage

<a id="existing-brace-code"></a>

### Existing Brace code

```js
const ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');

const editor = ace.edit('editor');
editor.session.setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');
```

<a id="scoped-imports"></a>

### Scoped imports

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

## Features and Integrations

<a id="what-is-preserved"></a>

### What is preserved

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

<a id="inline-workers"></a>

### Inline workers

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

<a id="documentation"></a>

### Documentation

- [Interactive documentation](https://alexandro.net/docs/vanilla/brace/)
- [Migration guide](https://github.com/alexandroit/stackline-brace/blob/main/MIGRATION.md)
- [Compatibility contract](https://github.com/alexandroit/stackline-brace/blob/main/COMPATIBILITY_CONTRACT.md)
- [Security policy](https://github.com/alexandroit/stackline-brace/blob/main/SECURITY.md)
- [Third-party licenses](https://github.com/alexandroit/stackline-brace/blob/main/THIRD_PARTY_LICENSES.md)
- [Changelog](https://github.com/alexandroit/stackline-brace/blob/main/CHANGELOG.md)

## Security

<a id="supply-chain"></a>

### Supply chain

Ace is an exact development-time generation input and is not installed for consumers. Generated assets are committed and the release records the upstream npm shasum and integrity value in `dist/build-meta.json`.

Every release gate covers:

- all paths published by `brace@0.11.1`;
- current generated inventory;
- esbuild browser bundles with CommonJS deep imports;
- a real Chrome editor with a functioning inline worker;
- TypeScript 3.9 and current TypeScript;
- direct and npm-alias installation from the packed tarball and registries;
- package metadata, documentation, runtime audit, checksums, and SBOM.

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-brace.git
cd stackline-brace
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-brace/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## Community and Support

Report reproducible package issues in the [issue tracker](https://github.com/alexandroit/stackline-brace/issues). Use the [security policy](https://github.com/alexandroit/stackline-brace/blob/main/SECURITY.md) for vulnerability reports.

- [Stackline / Alexandro.Net](https://alexandro.net/)
- [GitHub](https://github.com/alexandroit)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)
- [Reddit community: r/Stackline](https://www.reddit.com/r/Stackline/)

## License

<a id="independence-and-attribution"></a>

### Independence and attribution

`@stackline/brace` is independently maintained and is not affiliated with the original Brace or Ace maintainers.

Compatibility work derived from Brace is MIT licensed. Bundled Ace code remains BSD-3-Clause licensed. Both copyright notices and complete license texts are included in the package. See [NOTICE](https://github.com/alexandroit/stackline-brace/blob/main/NOTICE) and [THIRD_PARTY_LICENSES.md](https://github.com/alexandroit/stackline-brace/blob/main/THIRD_PARTY_LICENSES.md).
