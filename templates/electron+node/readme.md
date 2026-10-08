<!-- title -->

<!-- badges -->

<!-- short-description -->

## Overview

Based on [electron-vite](https://electron-vite.org) via the [@kitschpatrol/electron-vite](https://github.com/kitschpatrol/electron-vite) fork.

## Getting started

<!-- dependencies -->

<!-- development-dependencies -->

### Agent skills

`pnpm install` runs the `prepare` script to sync agent skills from installed
dependencies. Run `pnpm prepare` to refresh them after updating dependencies.
Generated agent directories and `skills-lock.json` are ignored by Git.

### Deployment

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
