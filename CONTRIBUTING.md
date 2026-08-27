# Contributing

## Development

Use Node.js 20 or newer for development:

```bash
npm ci
npm run verify
```

Generated runtime files under `mode`, `theme`, `ext`, `keybinding`, `snippets`, `worker`, and `dist` come from `npm run build`. Change `scripts/generate.mjs` or a source under `vendor/legacy`, then regenerate them.

## Compatibility

Do not remove or rename a historical deep import without a major release and a migration path. New work must keep zero runtime dependencies and include a test that exercises the packed tarball.

Security reports must follow [SECURITY.md](SECURITY.md).
