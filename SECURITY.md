# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x | Yes |
| 0.x and upstream `brace` | No |

## Reporting a vulnerability

Do not open a public issue for an undisclosed vulnerability. Use GitHub's private vulnerability reporting for `alexandroit/stackline-brace`.

Include the affected version, a minimal reproduction, expected impact, and any suggested mitigation. We will acknowledge a complete report within five business days and coordinate disclosure after a fix is available.

## Supply-chain posture

The published package has zero runtime dependencies. Ace is pinned at build time, vendored into the release, and recorded with its npm integrity hash. CI verifies the packed artifact and installation through the package's public name and the `brace` npm alias form.
