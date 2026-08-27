# Changelog

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
