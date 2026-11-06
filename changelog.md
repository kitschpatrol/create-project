# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

(Node.js support requirements have sometimes increased in minor or patch releases.)

## [1.12.1] - 2026-11-02

### Documentation

- Clarify that release scripts use existing pnpm registry authentication and show how to supply `NPM_TOKEN` when invoking a release.

### Maintenance

- Stop fetching and injecting an npm token inside the repository release script while retaining OTP retrieval.
- Update Bingo to 0.14 and refresh shared-config, MDAT, tsdown, workflow actions, and workspace installation policies.

## [1.12.0] - 2026-10-29

### Added

- Add `--github-token-command` to configure credentials for Electron projects that publish GitHub releases.

### Documentation

- Explain GitHub release authentication and pnpm-managed agent-skill installation, and update the documented pnpm requirement.

### Maintenance

- Replace skills CLI prepare hooks with pnpm workspace permissions and skill linking, and update pnpm to 12.16.1.
- Refresh dependencies and release/update workflows, build before lint/fix commands, and address CI lint memory exhaustion with a parser override and larger heap.

## [1.11.0] - 2026-10-08

### Added

- Support Cloudflare-oriented web generation with rendered preview, Vite, and Wrangler configuration and a current compatibility date.

### Changed

- Exclude local agent directories and skill lockfiles from published templates and generated projects, syncing dependency-provided skills during installation.

### Fixed

- Preserve executable-file metadata when rendering Handlebars template files.

### Documentation

- Document Cloudflare deployment, agent-skill synchronization, generated README expansion, and updated installation and publishing requirements.

### Maintenance

- Refresh Bingo and contributor tooling, replace bingo-handlebars with Handlebars, add scheduled dependency-update PRs, and adjust workspace compatibility overrides and link checks.

## [1.10.0] - 2026-09-30

### Fixed

- Model project types as literal unions so Bingo can parse `--type` and present its selection prompt correctly.

### Documentation

- Update generated help with explicit project-type choices, boolean `--help`, and repository and script-control options.

### Maintenance

- Migrate to Bingo 0.13 and Zod 4, refresh tooling, and fix link-check diagnostics and Windows nested-script test environments.

## [1.9.0] - 2026-09-17

### Documentation

- Clarify separate CLI/library build targets and normalize generated CLI help across local and CI environments.

### Maintenance

- Add integration checks for CLI/library packaging, executable output, imports, build cleanup, and benchmark baseline preservation.
- Upgrade to pnpm 12, Vitest 5, and tsdown 0.23; refresh shared-config, pin release actions, and rename `clean` to `clean-deep`.

## [1.8.0] - 2026-08-27

### Added

- Add a Lit web-component project type with a Vite development playground.

### Changed

- **Breaking:** Replace `--npm-auth-command` with `--npm-token-command`, adopt `NPM_TOKEN`, and add `--npm-otp-command` for publishing credentials.

### Fixed

- Show the correct `pnpm create @kitschpatrol/project@latest` command in the completion summary's rerun suggestion.

### Documentation

- Expand npm credential and installation guidance, and automatically generate clean CLI help in the README.

### Maintenance

- Refresh development dependencies and improve website link checks with sitemap discovery and pinned discovery tools.

## [1.7.1] - 2026-08-06

### Documentation

- Correct the tsx and npm access-token documentation links.

### Maintenance

- Simplify GitHub releases with semantic-version tag filters and explicit default-branch validation; adjust link-check exclusions.
- Refresh release and documentation tools, Taze, pnpm, CI setup, and workspace release-age exceptions.

## [1.7.0] - 2026-07-31

### Added

- Add `--type electron+node` for Electron projects with Node-targeted main and preload builds through electron-vite.

### Changed

- **Breaking:** Change the generator's Node.js runtime requirement from `>=20.19.0` to `^24.16.0 || >=26.3.0`.

### Documentation

- Describe available template types, list choices in CLI help, and expand runtime, local development, and template-maintenance guidance.

### Maintenance

- Add scheduled link checks and VS Code lint tasks, simplify TypeScript configurations, strengthen generated-file checks, and refresh dependencies and CI actions.

## [1.6.1] - 2026-07-14

### Maintenance

- Enable generated-project test-suite checks, add child-process timeouts and failure diagnostics, and skip Electron integration tests in CI.
- Refresh shared-config to 8.1, build/test tools, pnpm, and workspace release-age exceptions.

## [1.6.0] - 2026-07-08

### Maintenance

- Adapt template linting to ESLint 10 using per-template development overrides that are stripped during generation and checked by tests.
- Upgrade contributor tooling to shared-config 8 and TypeScript 6, require Node.js 24.16+ for development, and refresh pnpm, tests, and CI actions.

## [1.5.3] - 2026-06-13

### Maintenance

- Refresh shared-config, MDAT, build/test tools, and pnpm, and extend release-age exceptions to additional maintainer packages.

## [1.5.2] - 2026-06-06

### Documentation

- Explain local npm publishing, 1Password token retrieval, global pnpm authentication configuration, and authentication verification.

### Maintenance

- Refresh development tools and pnpm, and exempt `@kitschpatrol/*` packages from minimum release-age checks.

## [1.5.1] - 2026-05-20

### Fixed

- Preserve published template ignore files as `_gitignore` and rename them to `.gitignore` during generation.

## [1.5.0] - 2026-05-18

### Documentation

- Update the documented Unplugin consumer requirement to Node.js 22.22.2+.

### Maintenance

- Return contributor tooling to TypeScript 5.9 and refresh shared-config, MDAT, Taze, pnpm, and the development Node.js requirement.

## [1.4.0] - 2026-05-14

### Documentation

- Distinguish contributor Node.js and pnpm requirements from generated-package runtime requirements.

### Maintenance

- Upgrade to pnpm 11, migrate install-script permissions to `allowBuilds`, and refresh Bingo and development dependencies.
- Update CI actions, use `pnpm ci`, and pass publishing authentication directly to the publish command.

## [1.3.2] - 2026-05-02

### Fixed

- Expand HTML placeholders in Electron and web projects and the Unplugin playground.

### Documentation

- Clarify Electron and Unplugin Node.js requirements and expand contribution and tooling guidance.

### Maintenance

- Refresh development dependencies and add a generated-project test-suite check, initially disabled.

## [1.3.1] - 2026-04-11

### Maintenance

- Migrate contributor tooling to TypeScript 6 and shared-config 7.3, and correct lint and README validation commands.

## [1.3.0] - 2026-04-09

### Fixed

- Expand package metadata placeholders in the generated Unplugin playground.

### Maintenance

- Add Linux, macOS, and Windows CI with pinned actions and more resilient template build, cleanup, and timeout handling.
- Refresh contributor tools and linting, refine package exclusions, make cleanup portable, and support release tags with or without a `v` prefix.

## [1.2.9] - 2026-03-21

### Fixed

- Render Unplugin's Bun entry point and use the corrected test snapshot path during generation.

### Maintenance

- Refresh development tools, pnpm, editor settings, and repository metadata automation; add a major-version template dependency-update command.

## [1.2.8] - 2026-03-05

### Maintenance

- Upgrade tsdown to 0.21 and refresh MDAT and Taze.

## [1.2.7] - 2026-03-02

### Maintenance

- Update shared-config to 6.0.2.

## [1.2.6] - 2026-02-26

### Maintenance

- Declare `sideEffects: false` in package metadata.
- Refresh shared-config, pnpm, Node.js types, and GitHub Actions, and remove the npm publishing branch restriction.

## [1.2.5] - 2026-02-24

### Maintenance

- Move Zod from development dependencies to runtime dependencies.
- Configure minified tsdown builds without declarations, narrow build inputs, and refresh tooling with shared-config 6 and Node.js 22.21+ for contributors.

## [1.2.4] - 2026-01-25

### Maintenance

- Update shared-config to 5.13, refresh build/test tools, and migrate CSpell and Prettier configurations to TypeScript.

## [1.2.3] - 2026-01-19

### Maintenance

- Refresh shared-config, build/test/release tools, and pnpm, and update VS Code fixes on save.

## [1.2.2] - 2025-12-27

No notable changes.

## [1.2.1] - 2025-12-26

### Documentation

- Correct CLI invocation examples and GitHub/npm option descriptions, and remove temporary debugging notes from the README.

### Maintenance

- Update Bingo and filesystem dependencies, refresh contributor tooling, and move pnpm hoisting configuration into `pnpm-workspace.yaml`.

## [1.2.0] - 2025-11-08

### Added

- Add an Unplugin project type with placeholder expansion for bundler entry points and test snapshots.

### Changed

- Provide the current year when rendering template metadata and licenses.

### Maintenance

- Refresh development dependencies, revise repository linting, and configure Vitest to run root tests with quieter successful output.

## [1.1.3] - 2025-11-05

### Fixed

- Build the CLI with `.js` extensions and restore the executable path to `dist/index.js`.

## [1.1.2] - 2025-11-04

### Documentation

- Use `@latest` in the project creation command.

### Maintenance

- Upgrade tsdown to 0.16, change the executable path to `dist/index.mjs`, and refresh shared-config and Vitest.

## [1.1.1] - 2025-11-03

No notable changes.

## [1.1.0] - 2025-11-03

### Added

- Add `--type electron`, installing dependencies and applying fixes without automatically packaging the application.

### Changed

- **Breaking:** Replace `--npm-otp-command` with `--npm-auth-command` for granular npm token authentication.

### Documentation

- Add an example for running the built generator locally.

### Maintenance

- Refresh shared-config, build/test tools, and pnpm; add template dependency-update tooling and revise local publishing authentication.

## [1.0.4] - 2025-10-15

### Added

- Suggest amending the initial Git commit message after project generation.

### Fixed

- Use package metadata for CLI identification instead of the hardcoded `new-project` name and `0.0.0` version.

### Maintenance

- Add Vitest integration tests for template generation, builds, and linting, and refresh shared configuration.

## [1.0.3] - 2025-10-14

### Fixed

- Explicitly include template `.npmrc` files in published package contents.

## [1.0.2] - 2025-10-14

### Fixed

- Add template `.gitignore` paths to the npm publishing allowlist.

## [1.0.1] - 2025-10-14

### Changed

- Silence output from automatic dependency installation, build, and fix commands.

### Maintenance

- Restrict npm package contents to the built CLI and project templates.

## [1.0.0] - 2025-10-14

### Added

- Generate minimal, web, CLI, library, and combined CLI/library TypeScript projects with customizable author, package, repository, command-name, and npm publishing metadata.
- Support setup and transition modes, target-directory selection, offline operation, and automatic dependency installation, builds, and lint fixes.

### Documentation

- Document installation with `pnpm create @kitschpatrol/project`, Node.js 20.19+ requirements, and CLI usage and options.

### Maintenance

- Establish TypeScript builds, shared lint configuration, pnpm workspace setup, and npm/GitHub release tooling.

[1.0.0]: https://github.com/kitschpatrol/create-project/releases/tag/v1.0.0
[1.0.1]: https://github.com/kitschpatrol/create-project/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/kitschpatrol/create-project/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/kitschpatrol/create-project/compare/v1.0.2...v1.0.3
[1.0.4]: https://github.com/kitschpatrol/create-project/compare/v1.0.3...v1.0.4
[1.1.0]: https://github.com/kitschpatrol/create-project/compare/v1.0.4...v1.1.0
[1.1.1]: https://github.com/kitschpatrol/create-project/compare/v1.1.0...v1.1.1
[1.1.2]: https://github.com/kitschpatrol/create-project/compare/v1.1.1...v1.1.2
[1.1.3]: https://github.com/kitschpatrol/create-project/compare/v1.1.2...v1.1.3
[1.2.0]: https://github.com/kitschpatrol/create-project/compare/v1.1.3...v1.2.0
[1.2.1]: https://github.com/kitschpatrol/create-project/compare/v1.2.0...v1.2.1
[1.2.2]: https://github.com/kitschpatrol/create-project/compare/v1.2.1...v1.2.2
[1.2.3]: https://github.com/kitschpatrol/create-project/compare/v1.2.2...v1.2.3
[1.2.4]: https://github.com/kitschpatrol/create-project/compare/v1.2.3...v1.2.4
[1.2.5]: https://github.com/kitschpatrol/create-project/compare/v1.2.4...v1.2.5
[1.2.6]: https://github.com/kitschpatrol/create-project/compare/v1.2.5...v1.2.6
[1.2.7]: https://github.com/kitschpatrol/create-project/compare/v1.2.6...v1.2.7
[1.2.8]: https://github.com/kitschpatrol/create-project/compare/v1.2.7...v1.2.8
[1.2.9]: https://github.com/kitschpatrol/create-project/compare/v1.2.8...v1.2.9
[1.3.0]: https://github.com/kitschpatrol/create-project/compare/v1.2.9...v1.3.0
[1.3.1]: https://github.com/kitschpatrol/create-project/compare/v1.3.0...v1.3.1
[1.3.2]: https://github.com/kitschpatrol/create-project/compare/v1.3.1...v1.3.2
[1.4.0]: https://github.com/kitschpatrol/create-project/compare/v1.3.2...v1.4.0
[1.5.0]: https://github.com/kitschpatrol/create-project/compare/v1.4.0...v1.5.0
[1.5.1]: https://github.com/kitschpatrol/create-project/compare/v1.5.0...v1.5.1
[1.5.2]: https://github.com/kitschpatrol/create-project/compare/v1.5.1...v1.5.2
[1.5.3]: https://github.com/kitschpatrol/create-project/compare/v1.5.2...v1.5.3
[1.6.0]: https://github.com/kitschpatrol/create-project/compare/v1.5.3...v1.6.0
[1.6.1]: https://github.com/kitschpatrol/create-project/compare/v1.6.0...v1.6.1
[1.7.0]: https://github.com/kitschpatrol/create-project/compare/v1.6.1...v1.7.0
[1.7.1]: https://github.com/kitschpatrol/create-project/compare/v1.7.0...v1.7.1
[1.8.0]: https://github.com/kitschpatrol/create-project/compare/v1.7.1...v1.8.0
[1.9.0]: https://github.com/kitschpatrol/create-project/compare/v1.8.0...v1.9.0
[1.10.0]: https://github.com/kitschpatrol/create-project/compare/v1.9.0...v1.10.0
[1.11.0]: https://github.com/kitschpatrol/create-project/compare/v1.10.0...v1.11.0
[1.12.0]: https://github.com/kitschpatrol/create-project/compare/v1.11.0...v1.12.0
[1.12.1]: https://github.com/kitschpatrol/create-project/compare/v1.12.0...v1.12.1
