# Dependency Decisions

## Runtime

The package has zero runtime dependencies.

Ace is vendored into the published tarball instead of declared as a dependency. This preserves deterministic installations, prevents an upstream unpublish from breaking consumers, and keeps Brace's established deep-import package layout.

## Generation

`ace-builds@1.44.0` is pinned exactly as a development dependency. `scripts/generate.mjs` validates the version before writing runtime assets. `dist/build-meta.json` records the npm shasum and integrity string of the generation input.

## Development

- Browserify verifies the compatibility contract that motivated Brace.
- esbuild verifies a current bundler path.
- Playwright Core drives the system Chrome installation without downloading a browser.
- ESLint checks authored source, tests, examples, and documentation.
- publint and Are The Types Wrong inspect the packed package contract.
- TypeScript 3.9 and current TypeScript verify declarations.

Development dependencies are pinned and are not shipped to consumers. Runtime audit is required to report zero findings before release.

## 2026-09-28 Browserify development audit

The Browserify compatibility test retains `browserify@17.0.1`. Its unused
cryptography shim graph reaches `elliptic@6.6.1`, affected by
[GHSA-848j-6mx2-7j84](https://github.com/advisories/GHSA-848j-6mx2-7j84).
No patched elliptic version is published as of this review. The tests bundle
the editor and do not generate or use cryptographic private keys. These
dependencies are development-only and absent from the published package's
runtime closure. The full audit retains four low-severity dependency entries
for this one advisory; the production audit remains clean. The development
`qs` parser is pinned to the patched 6.16.0 release.

## Ace loader path normalization (2026-09-28)

The Ace 1.44.0 module loader repeated an unanchored `segment/../` regex.
Long relative module names passed to `ace.require` caused quadratic work, as
confirmed with adversarial all-dot names. `scripts/normalize-module-path.cjs`
replaces that loop at generation time; the build rejects a changed upstream
patch site. Linked segments and monotonic candidate queues retain Ace's exact
first `/./`, then first `segment/../` ordering in linear time and space. This
intentionally preserves non-POSIX edge cases and the existing plugin handling.
The generated runtime remains ES5-compatible and requires no additional module.
Regression tests compare 97,656 paths with the pinned upstream implementation,
resolve real relative/plugin modules, and bound large public-API inputs in a
child process. This addresses CodeQL alert 1 without suppressing its rule.
