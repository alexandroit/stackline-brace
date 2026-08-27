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
