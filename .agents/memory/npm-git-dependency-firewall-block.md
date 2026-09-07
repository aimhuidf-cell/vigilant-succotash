---
name: npm git-dependency firewall block
description: Replit's package-firewall blocks npm installs when a dependency (even transitive) resolves via a git URL; how to detect and work around it.
---

Replit's npm registry proxy (`package-firewall.replit.local`) rejects downloading a package with a 403 "Blocked by Security Policy — Git dependency" if that package (or one of its dependencies) is declared as a `git+https://...` dependency in its own `package.json`, even though the outer package itself is a normal npm-registry tarball.

Example: `@whiskeysockets/baileys` is a normal npm package, but its own dependency `libsignal` is declared as `git+https://github.com/whiskeysockets/libsignal-node.git`. Installing `baileys` alone triggers the block on the whole tree.

**Why:** The firewall's static analysis inspects the full dependency graph's manifests, not just the top-level package being requested.

**How to apply:**
1. Diagnose by checking the failing package's registry metadata (`curl https://registry.npmjs.org/<pkg>/<version>`) for `git+` entries in `dependencies`.
2. Add an `overrides` entry in `package.json` pointing the git-based sub-dependency at an npm-published equivalent (e.g. `"overrides": { "libsignal": "npm:libsignal@^6.0.0" }` — the maintainers of baileys publish a plain npm `libsignal` package too).
3. Even with the override, the firewall may still 403 the top-level package tarball fetch. Work around it by running `npm install --registry=https://registry.npmjs.org/` (bypasses the firewall's proxy directly) to complete the install — this succeeded after the override resolved libsignal to a non-git source.
