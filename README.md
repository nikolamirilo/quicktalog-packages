# @quicktalog/common

Shared TypeScript building blocks for the Quicktalog applications - published to npm and installed
by every service that needs to agree on the same types, constants, helpers, and database schema.

The goal is a single source of truth. When a catalogue gains a field or a pricing tier changes, it
changes here once, gets published, and every consumer picks it up by bumping a version rather than
re-declaring the shape locally and drifting out of sync.

## Installation

```bash
npm install @quicktalog/common
```

```ts
import { tiers, defaultCatalogueData, generateUniqueSlug, schema } from "@quicktalog/common";
```

Everything is re-exported from the package root, so there are no deep import paths to remember.

## What's inside

The package is ESM-only (`"type": "module"`) and ships compiled JavaScript plus `.d.ts`
declarations from `dist/`. Source lives in `src/` and is organised into four groups:

| Group | Path | Contents |
| --- | --- | --- |
| **Types** | `src/types/` | Domain models and unions - `Catalogue`, `ContentBlockType`, `Status`, `ThemeType`, `LimitType`, and friends |
| **Constants** | `src/constants/` | Shared values - `themes`, `layouts`, `tiers`, `BUSINESS_TYPES`, `defaultCatalogueData` |
| **Helpers** | `src/helpers/` | Small utilities such as `generateUniqueSlug` and `fetchImageFromUnsplash` |
| **Drizzle** | `src/drizzle/` | The Postgres schema, exported as a `schema` namespace, plus generated relations |

The Drizzle schema is **generated, not hand-written**. `src/drizzle/migrations/schema.ts` is
produced by `drizzle-kit pull`, which introspects the live Postgres database described by
`drizzle.config.ts`. Treat the database as authoritative and regenerate rather than editing those
files directly.

## Local development

```bash
npm install     # also installs the git hooks via the prepare script
npm run build   # tsc -> dist/
```

### Git hooks

A single Husky hook runs on commit:

```
.husky/pre-commit
  ├── npx drizzle-kit pull        (only when a real DB_CONNECTION_STRING is available)
  ├── npm run build
  └── npm version minor           (staged into the commit being made)
```

The drizzle step is guarded. It looks for `DB_CONNECTION_STRING` in the environment, falls back to `.env`,
and runs only if the value actually looks like a connection string. Without one it prints a skip
notice and moves on, so fresh clones and CI can commit without a database. The build always runs,
so a commit that does not typecheck cannot be created.

The bump runs last, after the build, and stages `package.json` and `package-lock.json` itself - so
the version lands in the commit you are making even though you staged everything before it ran.
Git has no `git add` hook, and this is the closest thing to one: the committed result is identical
to bumping before staging.

It is guarded too. The hook compares the version in the index against the version in `HEAD`, and
bumps only when they match. A commit that already carries a version change - `npm version` stages
its own bump and then commits, which re-enters this hook - is left alone, so a release never bumps
twice.

To commit without bumping (amending, fixing up, a docs-only change you do not want to ship):

```bash
SKIP_VERSION_BUMP=1 git commit -m "..."
```

There is deliberately **no pre-push hook**. It used to run `npm version minor` and collided with the
release script, bumping every release a second time on the push that followed.

> **Note:** when the drizzle step does run, it rewrites files under `src/drizzle/migrations/`
> *after* staging has already happened. Those regenerated files land in your working tree unstaged;
> review and commit them yourself.

## Release workflow

Publishing is driven entirely by the version in `package.json`. Pushing to `main` is what triggers
CI, but only a **new** version actually publishes.

Because every commit bumps the minor version, the work of releasing is already done by the time you
want to ship. `npm run release` only tags what is there and pushes:

```
npm run release
  ├── git tag v<current version>   -> tags the version your commits already produced
  └── git push --follow-tags       -> pushes the commits and the tag
```

`--follow-tags` matters: a plain `git push` leaves the tag stranded locally. `npm run release:patch`
and `npm run release:major` are still there for the rarer shapes - they bump on top of what the
hook produced, commit, and tag, which is what you want for a breaking change.

Because the bump lives *inside* the commit being pushed, the version CI sees is always the version
you intended to ship.

### What CI does

`.github/workflows/publish.yaml` runs on every push to `main`:

1. Checkout, set up Node 22, upgrade npm for OIDC support
2. `npm ci`
3. `npm run build`
4. **Check the registry** for the current `name@version`
5. `npm publish --access public` - only if that version does not already exist

Step 4 is what keeps ordinary commits green. Most pushes to `main` carry a fresh version and do
publish, but a re-run, a revert, or a commit made with `SKIP_VERSION_BUMP=1` builds and verifies as
usual and then skips publishing instead of failing on a version that is already taken. The job
summary states which path it took, so a green run never leaves you guessing whether it shipped.

### Authentication

There is no npm token. Publishing uses **OIDC trusted publishing** - GitHub Actions proves its
identity to npm directly, and npm attaches a signed [provenance](https://docs.npmjs.com/generating-provenance-statements)
statement to each release.

This is why `package.json` must carry a `repository` field pointing at this repo: npm validates the
provenance bundle against it and rejects the publish with `E422` if the two disagree.

## Conventions

- **Never edit `package.json` version by hand** - the pre-commit hook owns the bump; use the release scripts for anything larger
- **Never hand-edit the generated Drizzle schema** - change the database and re-pull
- `dist/` is gitignored and built by CI; only `src/` is tracked
