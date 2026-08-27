---
schema: stackline-package-project-memory-v1
project: 12
package: brace
target: "@stackline/brace"
state: BUILDING
decision: GO
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

## Mutable Release Evidence

Populate exact commit, artifact hashes, registries, CI, CodeQL, release, documentation, and clean-install results after independent publication checks.
