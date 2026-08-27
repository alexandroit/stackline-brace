# Compatibility Contract

`@stackline/brace` is designed as a maintained replacement for `brace@0.11.1`.

## Guaranteed in 1.x

- CommonJS root loading and ESM root loading.
- npm alias installation under the name `brace`.
- Side-effect deep imports for all paths shipped by `brace@0.11.1`.
- `acequire` as an alias of the current Ace `require` loader.
- Current Ace additions that do not remove old paths.
- TypeScript 3.9 declaration compatibility.
- Node.js 12 or newer for package loading and build-tool integration.
- Zero runtime dependencies.

## Browser workers

Importing a mode registers only the workers referenced by that mode. Existing `ace.config.setModuleUrl` values are never overwritten. Environments without Blob URL support can configure worker URLs manually or disable workers through the normal Ace API.

## Out of scope

This package does not change Ace's editor semantics. Ace behavior and browser support follow the embedded Ace release, while package layout compatibility follows Brace.
