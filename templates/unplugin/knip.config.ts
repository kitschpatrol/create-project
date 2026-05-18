import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['test/fixtures/**', 'playground/env.d.ts'],
	ignoreDependencies: [
		'@farmfe/core',
		'@kitschpatrol/aphex',
		'@sxzz/test-utils',
		'esbuild',
		'rollup',
		'tsx',
		'vite',
		'webpack',
	],
})
