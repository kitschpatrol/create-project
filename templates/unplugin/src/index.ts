import type { UnpluginInstance } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { createFilter } from 'unplugin-utils'
import type { Options } from './core/options'
import { resolveOptions } from './core/options'

/**
 * A starter unplugin template.
 */
export const starter: UnpluginInstance<Options | undefined, false> = createUnplugin(
	(rawOptions = {}) => {
		const options = resolveOptions(rawOptions)
		const filter = createFilter(options.include, options.exclude)

		const name = '{{{github-repository}}}'
		return {
			enforce: options.enforce,
			name,
			transform(code, _id) {
				return `// {{{github-repository}}} injected\n${code}`
			},
			transformInclude(id) {
				return filter(id)
			},
		}
	},
)
