# Upstream Audit

Audit date: 2026-08-27

## Baseline

- repository: `thlorenz/brace`
- npm release: `brace@0.11.1`, published 2018-02-14
- latest repository commit reviewed: `318f24f` from 2022
- package license: MIT
- bundled Ace license: BSD-3-Clause
- runtime dependencies: zero
- published files: 395
- published unpacked size: 8,456,804 bytes

## Demand

Official npm download measurements at the audit date showed 17,355,888 downloads in the preceding 12 months, 1,399,454 in the preceding 30 days, and 334,352 in the latest complete week. Public GitHub code still uses Brace deep imports in editor wrappers and applications across Angular, React, Vue, Nextcloud, Jekyll, and API tooling.

## Repository review

The upstream repository had 1,065 stars, 295 forks, 77 open issues, and 56 pull requests in the reviewed issue history. Recurring unresolved topics were grouped as follows:

- outdated embedded Ace generation;
- missing or removed modes, themes, and extensions;
- worker path 404s and custom worker setup failures;
- incomplete or mismatched TypeScript declarations;
- package size;
- accessibility fixes available in newer Ace releases;
- incomplete license disclosure for bundled Ace code.

The upstream build scripts clone an Ace tag, apply broad textual rewrites, and patch worker internals with brittle occurrence counts. The original tests require a manually opened browser and do not verify a packed artifact or current bundlers.

## Findings in the published contract

- `mavens_mate_log` references a highlight-rules module that is not shipped.
- `swig` registers highlight rules under the mode identifier but does not expose a `Mode` constructor.
- the original npm tarball includes Ace's BSD-licensed code while exposing only the Brace MIT license file;
- Browserify compatibility depends on rewriting Ace's internal `require` identifier;
- worker source is stringified but support is limited and coupled to exact Ace internals.

## Stackline scope

`@stackline/brace@1.0.0` retains the complete old deep-path inventory, repairs broken historical paths with documented compatibility aliases, regenerates the runtime from `ace-builds@1.44.0`, and tests the result in Browserify, esbuild, Node, and Chrome. The engine itself remains Ace; this project owns packaging compatibility, worker portability, release quality, and transparent attribution.
