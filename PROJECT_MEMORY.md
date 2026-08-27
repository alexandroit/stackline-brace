---
schema: stackline-package-project-memory-v1
project: 12
package: brace
target: "@stackline/brace"
state: PUBLISHED
decision: GO
registry_scope: verdaccio-and-public-npm
public_npm: true
public_github: true
docs_production: true
last_updated: 2026-08-27
---

# Project 12 Memory

The project passed the GO gate on 2026-08-27. It preserves the `brace@0.11.1` package-layout contract while replacing the embedded editor with Ace 1.44.0 and a reproducible inline-worker build.

## Release Target

- version: `1.0.0`
- Node package loading: 12 through 24
- browser integration: Browserify and current bundlers
- modules: CommonJS runtime plus ESM root facade
- TypeScript: 3.9 plus current
- runtime dependencies: zero
- migration: `brace@npm:@stackline/brace`
- docs: `https://alexandro.net/docs/vanilla/brace/`

## Compatibility Notes

- all JavaScript paths from `brace@0.11.1` are retained;
- `mavens_mate_log` maps to text because its published highlight dependency was absent;
- `swig` maps to Twig because its published module did not expose a Mode;
- old Bro, LiveScript, and MIPS spellings map to current Ace identifiers;
- existing worker URLs are never overwritten.

## Production Release

- package: `@stackline/brace@1.0.0`;
- npm: https://www.npmjs.com/package/@stackline/brace;
- Verdaccio: published from the exact same tarball as npm;
- source: https://github.com/alexandroit/stackline-brace;
- release: https://github.com/alexandroit/stackline-brace/releases/tag/stackline-v1.0.0;
- documentation: https://alexandro.net/docs/vanilla/brace/;
- source and tag commit: `6eee9182a8207d4741ec3e74042f91d2a0af9be5`;
- tarball SHA-1: `d28642e581f9b160af937a811330b0e14b426d78`;
- tarball SHA-256: `967ec4e71b8d404045d195f6777fcd7ba691100515081971c578f56e3495c105`;
- npm integrity: `sha512-z2Iq+Yz3CVeD5XK1EhpiZ+4yMPNOMINu5s0YJBiJRBGxQyP4H0gNxxXJPvVBYJjZoZ41FUgh9KdKvU/bvmbO1A==`;
- packed size: 2,569,272 bytes; unpacked size: 10,826,939 bytes; 520 files;
- CI: https://github.com/alexandroit/stackline-brace/actions/runs/33043420462;
- CodeQL: https://github.com/alexandroit/stackline-brace/actions/runs/33043420479.

## Production Verification

- Node.js 12, 14, 16, 18, 20, 22, and 24 passed;
- all legacy `brace@0.11.1` paths and the complete generated Ace inventory
  passed;
- Browserify, esbuild, real Chrome editor, theme, mode, and inline-worker tests
  passed;
- TypeScript 3.9 and current TypeScript, packed artifact, `publint`, Are the
  Types Wrong, documentation, audit, CI, and CodeQL gates passed;
- direct scoped installation and the `brace` npm alias passed from Verdaccio
  and from the official npm registry;
- npm metadata independently returned the release SHA-1, integrity, file count,
  and unpacked size shown above;
- the public documentation, canonical URL, editor image, catalog entry, and six
  aggregate sitemap URLs returned through Cloudflare on 2026-08-27.
