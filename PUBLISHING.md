# Publishing

## Local release gate

```bash
npm ci
npm run verify
```

Build one immutable tarball, record SHA-256 and SHA-512, and publish the same bytes to Verdaccio and npm. Do not rebuild between registries.

## GitHub trusted publishing

The `Publish to npm` workflow supports npm Trusted Publishers through GitHub Actions OIDC. Configure npm with:

- organization or user: `alexandroit`
- repository: `stackline-brace`
- workflow: `publish.yml`
- environment: none

The workflow requires the expected SHA-512 digest and rejects a version already present in the public registry.

Token-based publication remains available for an authorized maintainer, but the artifact and verification requirements are the same.
