# Changelog

## [1.0.2] - 2026-09-28

- Replace the development-only Browserify dependency in browser tests and documentation builds with the existing esbuild toolchain, removing the unpatched elliptic advisory GHSA-848j-6mx2-7j84 from the full dependency tree.
- Preserve the same CommonJS fixture, deep imports, editor, mode, theme, inline worker blob and real Chromium worker-annotation assertions; retain the Browserify-compatible package wrappers and public API unchanged.
- Browserify itself is no longer executed by the maintained release tests; compatibility is retained by the existing CommonJS source format and side-effect imports.

## [1.0.1] - 2026-09-28

- Replace quadratic Ace loader path normalization with a linear compatibility-preserving segment rewrite.
- Organize package documentation, preserve API and migration examples, and add Stackline community links.
- Update the development-only qs parser to 6.16.0; preserve the existing runtime dependency contract.
- Improve package discovery keywords with precise domain terms and `stackline`.
- Pin GitHub Actions release tooling and require an explicit missing-version response before publication.


All notable changes to `@stackline/brace` are documented here.

## 1.0.0 - 2026-08-27

### Added

- Ace Editor 1.44.0 generated runtime with current modes, themes, extensions, keybindings, snippets, and workers.
- Browser-local inline worker registration that respects consumer overrides.
- CommonJS root, ESM facade, and TypeScript declarations tested with TypeScript 3.9 and current TypeScript.
- Browserify, esbuild, real Chrome, packed-artifact, and npm alias regression tests.
- Reproducible asset inventory, upstream integrity metadata, release checksums, and SBOM workflow.

### Preserved

- Brace root API and side-effect deep imports.
- Historical mode, extension, snippet, theme, keybinding, and worker paths from `brace@0.11.1`.
- Zero runtime dependencies.

### Fixed

- Worker 404 failures for bundled editors by registering imported workers as Blob URLs.
- Missing and stale editor capabilities by moving from the old embedded Ace generation to Ace 1.44.0.
- Type declaration gaps around the loader, config, version, optional modes, and font sizes.
- The historically incomplete `mavens_mate_log` and `swig` mode imports now resolve to functional text and Twig compatibility modes.
- Incomplete disclosure of the BSD-licensed Ace code included by the original package.
