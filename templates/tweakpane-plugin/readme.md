<!-- title -->

<!-- badges -->

<!-- description -->

## Overview

A [Tweakpane](https://tweakpane.github.io/docs/) 4 plugin for custom text input.

## Getting started

### Dependencies

The plugin requires [Tweakpane 4](https://www.npmjs.com/package/tweakpane).

The `/lite` export path imports [@tweakpane/core](https://www.npmjs.com/package/@tweakpane/core) rather than bundling it. It is installed as a dependency of this plugin, so only projects without a bundler need to provide it directly.

<!-- install -->

## Usage

```ts
import * as plugin from '{{{github-repository}}}'
import { Pane } from 'tweakpane'

const pane = new Pane()
pane.registerPlugin(plugin)

const params = { message: 'Hello, Tweakpane!' }
pane.addBinding(params, 'message', {
  placeholder: 'Enter a message',
  view: 'text-input',
})
```

The playground in `demo/index.html` contains a working example.

To externalize and share `@tweakpane/core` as a separate dependency through your bundler, import from `{{{github-repository}}}/lite` instead.

## Development notes

This plugin was built from the [@kitschpatrol/create-project](https://github.com/kitschpatrol/create-project) Tweakpane plugin template, which differs from the [official template](https://github.com/tweakpane/plugin-template) in a number of ways. It uses a more modern toolchain with improved treeshaking. It also exports a special `/lite` package entry point which excludes the `@tweakpane/core` dependency, which can help keep loading times down in projects that use multiple Tweakpane plugins.

<!-- contributing -->

<!-- license -->
