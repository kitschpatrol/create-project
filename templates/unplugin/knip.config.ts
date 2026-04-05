import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['test/fixtures/**'],
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
