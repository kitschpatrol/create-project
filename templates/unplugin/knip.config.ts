import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['test/fixtures/**', 'playground/env.d.ts'],
	ignoreDependencies: [
		'@farmfe/core',
		'@kitschpatrol/aphex',
		'@nuxt/kit',
		'@nuxt/schema',
		'@sxzz/test-utils',
		'esbuild',
		'rollup',
		'tsx',
		'vite',
		'webpack',
	],
})
