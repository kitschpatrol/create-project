<!-- title -->

<!-- badges -->

<!-- short-description -->

## Overview

## Getting started

<!-- dependencies -->

<!-- development-dependencies -->

<!-- install -->

### Agent skills

`pnpm install` links agent skills from `@kitschpatrol/shared-config` into
`.agents/skills` and `.claude/skills`, as configured by the `permissions` and
`skills` settings in `pnpm-workspace.yaml`. Both directories are ignored by Git.

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
