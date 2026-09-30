<!-- title -->

<!-- badges -->

<!-- short-description -->

## Overview

## Getting started

<!-- development-dependencies -->

### Deployment

The site is served from a subdirectory matching the repository name. The Vite
`base` path and nested `build.outDir` in `vite.config.ts` keep asset paths
aligned with the public URL, following
[Cloudflare's subdirectory layout](https://developers.cloudflare.com/workers/static-assets/routing/advanced/serving-a-subdirectory/).
Update `base` in `vite.config.ts` and the URL in `scripts/preview.ts` when
hosting at another path.

- `pnpm build` clears `dist/`, builds the site, and writes `version.json` next
  to it.
- `pnpm preview` builds the site, starts Wrangler's local Workers runtime with
  the same static asset configuration as deployment, and opens the site once
  the server is ready. Re-run it after source changes; use `pnpm dev` for
  Vite's live editing.
- `pnpm release` bumps the version, builds the site, and deploys it with
  Wrangler. It requires Cloudflare authentication.

[`wrangler.jsonc`](wrangler.jsonc) serves the build as static assets on the
Worker's `workers.dev` address, using
[`drop-trailing-slash`](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/#drop-trailing-slashes)
so the page is served without a trailing slash. To serve the site from a custom
domain, add a
[route](https://developers.cloudflare.com/workers/configuration/routing/routes/)
such as `example.com/repository-name*` for a zone in your Cloudflare account.

`scripts/versions.ts` writes `version.json` after Vite finishes, with the build
date, package name and version, and Git branch, short commit, commit date, and
latest reachable tag. Unavailable Git fields are `null`. The `deployment` field
is `preview` for prerelease package versions and `main` otherwise.

### Benchmarks

Run `pnpm bench` to measure the example in `test/index.bench.ts`. Run
`pnpm bench:baseline` to save or replace `test/benchmarks/baseline.json`;
subsequent `pnpm bench` runs compare against it without overwriting it.
Use a separate result file for each benchmark you add, and generate baselines
in a consistent environment. Vitest 4 benchmark JSON files must be regenerated
with Vitest 5.

## Maintainers

_List maintainer(s) for a repository, along with one way of contacting them (e.g. GitHub link or email)._

## Acknowledgments

_State anyone or anything that significantly helped with the development of your project. State public contact hyper-links if applicable._

<!-- contributing -->

<!-- license -->
