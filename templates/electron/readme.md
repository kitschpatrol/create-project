<!-- title -->

<!-- badges -->

<!-- short-description -->

## Overview

Based on [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)'s [quick-start sample](https://github.com/caoxiemeihao/electron-vite-samples/tree/main/quick-start).

## Getting started

<!-- dependencies -->

<!-- development-dependencies -->

### Agent skills

`pnpm install` links agent skills from `@kitschpatrol/shared-config` into
`.agents/skills` and `.claude/skills`, as configured by the `permissions` and
`skills` settings in `pnpm-workspace.yaml`. Both directories are ignored by Git.

### Deployment

`pnpm release` bumps the version, then builds, signs, notarizes, and publishes the app to GitHub Releases.

macOS signing is off until you delete `identity: null` from the `mac` section of `electron-builder.ts`. electron-builder then signs with the Developer ID Application certificate in your Keychain, and `pnpm release` notarizes the signed app with the `notarytool` Keychain profile. Store your credentials in it once per machine:

```sh
xcrun notarytool store-credentials notarytool --apple-id <apple-id-email> --team-id <team-id>
```

The command prompts for an app-specific password, which you can create at [account.apple.com](https://account.apple.com). Your team ID is listed in the [Apple Developer account](https://developer.apple.com/account) membership details.

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
