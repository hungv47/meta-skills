# Conquistador skill versions

Per-skill version tracking with first-public-release semantics. The authoritative version for each
skill is `metadata.version` in its own `SKILL.md` frontmatter. This file is the package-wide,
human-readable reference and must stay in exact sync with those frontmatter values
(`tools/release/verify-version.ts` enforces the match).

## Versioning semantics

- **Package-era reconstruction baseline (`2.0.0`).** The existing reconstructed skills — including the
  default Conquistador agent — carry `2.0.0`. This denotes the first-public-release baseline under the
  current package architecture. It does **not** imply that a public `1.x` was previously released;
  public distribution has been paused and no public release has shipped, so these are first-public
  release versions, not continuations of a released line.
- **Newly introduced outcomes (`1.0.0`).** Skills introduced since that reconstruction baseline start
  at `1.0.0`.
- **Independent of the package version.** A skill version is not required to equal the package /
  marketplace version, and the package version is not required to equal any skill version.

## Version table

| Skill | Version |
|---|---|
| brief-creative | 2.0.0 |
| brief-product-ui | 2.0.0 |
| conquistador | 2.0.0 |
| create-brand | 2.0.0 |
| create-paid-campaign | 2.0.0 |
| create-shortform | 2.0.0 |
| debate-agents | 1.0.0 |
| improve-conversion | 2.0.0 |
| knowledge-review | 1.0.0 |
| map-user-flow | 2.0.0 |
| measure-growth | 2.0.0 |
| model-growth-funnel | 2.0.0 |
| optimize-search | 2.0.0 |
| plan-campaign | 2.0.0 |
| polish-vietnamese | 2.0.0 |
| research-channel | 2.0.0 |
| research-positioning | 2.0.0 |
| write-copy | 2.0.0 |
| write-longform | 2.0.0 |
| write-outreach | 2.0.0 |
| write-social | 2.0.0 |

## Changelog

### 2026-08-03 — first-public-release baseline

- Reconstructed package-era skills and the default Conquistador agent baseline at `2.0.0`
  (first-public-release semantics).
- Newly introduced outcomes `debate-agents` and `knowledge-review` baseline at `1.0.0`.
- Added a `metadata.version` to every public skill and extended `verify-version.ts` to require valid
  frontmatter versions and exact `VERSIONS.md` ↔ frontmatter coverage without forcing skill versions
  to equal the package version.
