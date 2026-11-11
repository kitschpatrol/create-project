import type { TpPlugin } from '@tweakpane/core'
import { textInputPlugin } from './plugin'
import pluginCss from './styles/plugin.scss?inline'

export type { TextInputParams } from './plugin'

// Identifier of this plugin bundle. Tweakpane installs each bundle's styles
// once per document, keyed by this ID, so the ID must be unique.
export const id = '{{{github-repository}}}'

// Plugins that `pane.registerPlugin()` adds to the pane.
export const plugins: TpPlugin[] = [textInputPlugin]

// Compiled styles, installed by Tweakpane when the bundle is registered.
export const css: string = pluginCss
