<!-- title -->

# @kitschpatrol/create-project

<!-- /title -->

<!-- badges -->

[![NPM Package @kitschpatrol/create-project](https://img.shields.io/npm/v/@kitschpatrol/create-project.svg)](https://www.npmjs.com/package/@kitschpatrol/create-project)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit)
[![CI](https://github.com/kitschpatrol/create-project/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/create-project/actions/workflows/ci.yml)

<!-- /badges -->

<!-- short-description -->

**Kitschpatrol's TypeScript project templates.**

<!-- /short-description -->

## Overview

This repository contains very basic starter templates for TypeScript projects integrating [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config).

The lint tools and rules that come along with [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config) are opinionated and draconian, and won't be to everyone's taste.

The templates use [tsdown](https://tsdown.dev/) for building TypeScript libraries and Node-based CLI tools, and [Vite](https://vite.dev/) for web projects. [Bingo](https://www.create.bingo/) is used for the project templating system itself.

Nine template types are available:

| Template        | Description                                                                                                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minimal`       | Bare TypeScript scratch project, run with [tsx](https://tsx.hirok.io) — no build step.                                                                                                                                                                                                   |
| `web`           | [Vite](https://vite.dev/) web app with [Vitest](https://vitest.dev/) tests.                                                                                                                                                                                                              |
| `cli`           | Node.js command-line tool using [yargs](https://yargs.js.org/), bundled with [tsdown](https://tsdown.dev/) for publication to npm.                                                                                                                                                       |
| `library`       | ESM npm library with type declarations, bundled with [tsdown](https://tsdown.dev/).                                                                                                                                                                                                      |
| `cli+library`   | Combined npm library and CLI in a single package.                                                                                                                                                                                                                                        |
| `lit`           | Single [Lit](https://lit.dev/) web component published as an ESM npm package, with a [Vite](https://vite.dev/) development playground.                                                                                                                                                   |
| `electron`      | [Electron](https://www.electronjs.org/) app using [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron) and [electron-builder](https://www.electron.build/).                                                                                                     |
| `electron+node` | [Electron](https://www.electronjs.org/) app with Node-targeted main and preload builds via [electron-vite](https://electron-vite.org) (using the [@kitschpatrol/electron-vite](https://github.com/kitschpatrol/electron-vite) fork) and [electron-builder](https://www.electron.build/). |
| `unplugin`      | Universal bundler plugin via [unplugin](https://unplugin.unjs.io/), targeting Vite, Rollup, Rolldown, webpack, Rspack, esbuild, Farm, and Bun.                                                                                                                                           |

## Getting started

### Dependencies

[Node.js](https://nodejs.org/) 24.16+ and [pnpm](https://pnpm.io/) 11+ are required to develop this project and to work on the projects it generates (a requirement inherited from [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config)). Generated packages declare the same floor in their `engines` field: `^24.16.0 || >=26.3.0`.

## Usage

### Create a new project

```sh
pnpm create @kitschpatrol/project@latest
```

If you have pnpm's [minimumReleaseAge](https://pnpm.io/settings/dependency-resolution#minimumreleaseage) option enabled, you might need to disable it if you trust this repository and really want the _latest_ latest:

```sh
pnpm --config.minimum-release-age=0 create @kitschpatrol/project@latest
```

### CLI options

<!-- cli-help-trimmed -->

```txt
Bingo template options:

  --directory (string): What local directory path to run under
      npx @kitschpatrol/create-project --directory my-fancy-project

  --help (string): Prints help text.
      npx @kitschpatrol/create-project --help

  --mode ("setup" | "transition"): Which mode to run in.
      npx @kitschpatrol/create-project --mode setup
      npx @kitschpatrol/create-project --mode transition

  --offline (boolean): Whether to run in an "offline" mode that skips network requests.
      npx @kitschpatrol/create-project --offline

  --remote (boolean): Whether to create a remote repository on GitHub if one does not already exist.
      npx @kitschpatrol/create-project --remote

  --skip-files (boolean): Whether to skip creating files on disk.
      npx @kitschpatrol/create-project --skip-files

  --skip-requests (boolean): Whether to skip sending network requests as specified by templates.
      npx @kitschpatrol/create-project --skip-requests

  --version (boolean): Prints package versions.
      npx @kitschpatrol/create-project --version


Create Kitschpatrol Project options:

  --type (enum): The type of project to create (minimal, web, cli, library, cli+library, lit, electron, electron+node, unplugin).
  --author-name (string): The name of the author.
  --author-email (string): The email of the author.
  --author-url (string): The URL of the author.
  --cli-command-name (string): CLI command name (if applicable).
  --github-owner (string): The owner of the repository.
  --github-repository (string): The name of the repository / package.
  --npm-token-command (string): A shell command that returns a granular token for publishing to the npm registry.
  --npm-otp-command (string): A shell command that returns a one-time password for publishing to the npm registry.
```

<!-- /cli-help-trimmed -->

### npm Publishing configuration

I publish most of my packages via a local command instead of through CI.

Most template projects include a `release` script for this purpose.

Two credentials are passed at the last minute to the `pnpm publish` command in the `release` script. The template must define how to fetch these.

#### npm token

> [!WARNING]
>
> This is currently broken pending resolution of [pnpm/issues/12828](https://github.com/pnpm/pnpm/issues/12828).
>
> The call to `--npm-token-command` won't actually populate the token, so you will need to provide the token in your environment in a different way.

As of November 2025, [granular access tokens](https://docs.npmjs.com/about-access-tokens#about-granular-access-tokens) are required for publishing packages to npm.

The default `--npm-token-command` template value expects you to have the [1Password CLI installed](https://1password.com/downloads/command-line), [npm access token](https://docs.npmjs.com/about-access-tokens/) configured and stored at a specific path in 1Password, and for your global configuration to look a certain way.

This requires some one-time global configuration on the deploy machine.

```sh
pnpm config set '//registry.npmjs.org/:_authToken' '${NPM_TOKEN}'
```

Check who pnpm thinks you are to confirm everything works:

```sh
NPM_TOKEN=$(op read 'op://Personal/npm/token') pnpm whoami
```

#### npm one-time password

As of August 2026, [2fa is required](https://docs.npmjs.com/about-access-tokens#account-identity-actions-require-an-interactive-2fa-challenge) alongside the token for publishing packages to npm.

The default `--npm-otp-command` template value expects you to have the [1Password CLI installed](https://1password.com/downloads/command-line), with your npm OTP configured and stored at a specific path in 1Password.

## Development Notes

Build and run the CLI locally:

```sh
pnpm build
./dist/index.js --directory ~/Desktop/test
```

Update dependencies in every template:

```sh
pnpm update-templates
```

The templates are pnpm workspace members of this repository, so they are linted (with their own `eslint.config.ts` files) by the root `pnpm lint`. Lint rule overrides between `Template-dev-only` markers silence placeholder-value errors during template development and are stripped from generated projects.

## Maintainers

[kitschpatrol](https://github.com/kitschpatrol)

## Acknowledgments

Thanks to [Josh Goldberg](https://www.joshuakgoldberg.com/) for creating the [Bingo](https://www.create.bingo/) template system.

<!-- contributing -->

## Contributing

[Issues](https://github.com/kitschpatrol/create-project/issues) are welcome and appreciated.

Please open an issue to discuss changes before submitting a pull request. Unsolicited PRs (especially AI-generated ones) are unlikely to be merged.

This repository uses [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config) (via its `ksc` CLI) for linting and formatting, plus [MDAT](https://github.com/kitschpatrol/mdat) for readme placeholder expansion.

<!-- /contributing -->

<!-- license -->

## License

[MIT](license.txt) © [Eric Mika](https://ericmika.com)

<!-- /license -->
