import type { UnpluginInstance } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './core/options'
import { resolveOptions } from './core/options'

/**
 * A starter unplugin template.
 */
export const starter: UnpluginInstance<Options | undefined, false> = createUnplugin(
	(rawOptions = {}) => {
		const options = resolveOptions(rawOptions)

		const name = '{{{github-repository}}}'
		return {
			enforce: options.enforce,
			name,
			transform: {
				filter: {
					id: {
						include: options.include,
						exclude: options.exclude,
					},
				},
				handler(code, _id) {
					return `// {{{github-repository}}} injected\n${code}`
				},
			},
		}
	},
)
