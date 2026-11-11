# Tweakpane plugin migration

These notes describe the package contract of the `tweakpane-plugin` template in `templates/tweakpane-plugin` and how the existing Tweakpane 4 plugins were moved onto it in November 2026. They cover color-plus and ten forks maintained mainly for [Svelte Tweakpane UI](https://github.com/kitschpatrol/svelte-tweakpane-ui).

## Package contract

Every plugin publishes four flat ES module files named after its repository:

| File                        | Core     | Minified | Export   |
| --------------------------- | -------- | -------- | -------- |
| `dist/<plugin>.js`          | Bundled  | No       | `.`      |
| `dist/<plugin>.min.js`      | Bundled  | Yes      |          |
| `dist/<plugin>.lite.js`     | External | No       | `./lite` |
| `dist/<plugin>.lite.min.js` | External | Yes      |          |

- The package root behaves like a standard Tweakpane plugin: it bundles `@tweakpane/core`, and Tweakpane is a peer dependency. The `/lite` entry imports core so an application bundler can share one copy across plugins. The forks previously externalized core at the root, so consumers that want a shared core now import `/lite`.
- The export map contains only `.`, `./lite`, and `./package.json`. Both entries share one bundled `dist/<plugin>.d.ts` with core and Tweakpane types left external. Public types are re-exported from `src/index.ts`, replacing the old per-file `dist/types` declarations.
- `@tweakpane/core` stays in `dependencies` because the lite builds and the published types import it.
- The bundle exports `id`, `css`, and `plugins`. The `id` is a hard-coded string: Tweakpane installs a bundle's CSS once per document keyed by it, so two bundles with the same id silently lose one stylesheet. The thumbnail-list fork had copied the textarea plugin's `textarea` id and now uses `thumbnail-list`.
- JavaScript targets ES2022. There are no source maps and no release archives.

## Build

`tsdown.config.ts` defines four configurations, named `bundled`, `bundled-min`, `lite`, and `lite-min`, over one shared base:

- The bundled configurations set `deps.alwaysBundle` and `deps.onlyBundle` to `@tweakpane/core`. Without `onlyBundle`, tsdown prints a hint on every build; with it, the build fails if anything else is inlined. color-plus also bundles `colorjs.io` into all four builds.
- `attw` and `publint` are set on `bundled` only. tsdown waits until every configuration of a package has finished, then packs the package once and checks the tarball, which covers both exports. Setting them on more than one configuration only produces a duplicate-configuration warning.
- `@tweakpane/core` declares no `sideEffects`, so a `moduleSideEffects` hook marks its modules side-effect free. The bundled builds then keep only the parts of core a plugin uses.
- `tsdown` and `@tsdown/css` are pinned to the same version while tsdown's CSS support is experimental.

## Styles

- `src/styles/plugin.scss` is imported with `?inline` and exported as `css`; Tweakpane installs it when the plugin is registered.
- Sass resolves `@use '@tweakpane/core/lib/sass/tp'` through `loadPaths: ['node_modules']`. Core's helpers call deprecated Sass functions such as `lighten()`, so tsdown and Vite set `quietDeps` to report only the plugin's own warnings.
- Sass does not evaluate SassScript inside custom property values. Interpolate helpers there (`--x: #{tp.cssVar('container-unit-size')}`); thumbnail-list had shipped the literal function text.
- `stylelint.config.js` adds `stylelint-config-standard-scss` for `.scss` files. A few plugins disable `defensive-css` hover or focus rules, with a comment, where they restyle core's unconditional `:hover` or `:focus` states.

## Types and lint

- `tsconfig.json` extends `@kitschpatrol/typescript-config` and sets only `target: ES2022`, `lib: ["ES2022", "DOM"]` (TypeScript 6 folds `DOM.Iterable` into `DOM`), and `types: ["node", "vite/client"]`. No plugin relaxes the preset. `tsconfig.build.json` limits the declaration build to `src/`.
- `eslint.config.ts` keeps automatic fixes inside ES2022: `ecmaVersion: 2022`, the `u` flag for `require-unicode-regexp`, and the unicorn and e18e rules whose fixes produce ES2023's `toSorted`, `toReversed`, or `toSpliced` turned off.
- The forks add one shared block for `src` and `test` that follows Tweakpane core's own conventions: null sentinels in plugin APIs (`unicorn/no-null`, `ts/no-restricted-types`), trailing-underscore private members (`ts/naming-convention`), the `ClassName()` factory (a `new-cap` exception), methods bound in constructors (`ts/unbound-method`), and `TpError`, which does not extend `Error` (`ts/only-throw-error`). color-plus uses the subset it needs. file-import and image also turn off `node/no-unsupported-features/node-builtins`, which mistakes browser `File` APIs for Node.js built-ins.
- `unicorn/name-replacements` appends `_` when a full word collides with a browser global (`event`, `length`, `module`). Rename those locals by hand; a trailing underscore marks a private member in Tweakpane code.
- Source file names are kebab-case.

## Demos and tests

- `demo/index.html` imports `../src/index.ts` from an inline module script. The page has no HMR boundary, so Vite reloads it on any source or stylesheet change and Tweakpane installs the new styles. No HMR code is needed. color-plus keeps its named demos under `demo/`.
- Tests live in `test/` and run under Vitest with happy-dom and `css: true`. `test/index.test.ts` covers registration, compiled CSS, parameter acceptance, interaction, refresh, the disabled state, and disposal. Other files cover pure logic.
- create-project's template test packs a generated plugin and imports all four builds in Node.

## Consumers

Svelte Tweakpane UI imports the forks from their package roots and deep-imports `dist/types` declarations in 26 places across nine forks. Those paths no longer resolve. It should import `/lite` everywhere, as it already does for color-plus, and take types from the package entry.

## Migrating another plugin

1. Generate a reference project separately and copy its configuration, keeping the plugin's package name, version, authors, license, bundle id, view names, and parameters.
2. Move styles to `src/styles/` and replace any CSS placeholder with the `?inline` import.
3. Re-export public types from `src/index.ts`, then build and check that `dist/` holds exactly the four JavaScript files and one declaration file.
4. Replace the old build, watch, and archive scripts with the template's scripts and remove their dependencies.
5. Run `pnpm build`, `pnpm fix`, `pnpm lint`, and `pnpm test` until all are clean, reviewing every autofix that touches runtime code.
6. Write tests for registration and each view's behavior, then update known consumers' imports.

## Inventory

| Project                           | Bundle id        | Notes                                                                        |
| --------------------------------- | ---------------- | ---------------------------------------------------------------------------- |
| `tweakpane-plugin-camerakit`      | `camerakit`      | Ring and wheel views.                                                        |
| `tweakpane-plugin-color-plus`     | `color-plus`     | Original plugin. Bundles `colorjs.io` into all four builds.                  |
| `tweakpane-plugin-essentials`     | `essentials`     | Interval, button grid, radio grid, cubic Bézier, and FPS graph.              |
| `tweakpane-plugin-file-import`    | `file-input`     | File input with drag and drop.                                               |
| `tweakpane-plugin-image`          | `input-image`    | Image input; the reader passes unsupported values through unchanged.         |
| `tweakpane-plugin-inputs`         | `inputs`         | Stepper input.                                                               |
| `tweakpane-plugin-profiler`       | `profiler`       | Profiler blade and measurement API.                                          |
| `tweakpane-plugin-rotation`       | `rotation`       | Euler and quaternion inputs.                                                 |
| `tweakpane-plugin-textarea`       | `textarea`       | Multiline text input.                                                        |
| `tweakpane-plugin-thumbnail-list` | `thumbnail-list` | Thumbnail picker, ported to Tweakpane 4; previously reused `textarea` as id. |
| `tweakpane-plugin-waveform`       | `waveform`       | Waveform monitor.                                                            |
