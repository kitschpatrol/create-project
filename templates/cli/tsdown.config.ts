import { defineConfig } from 'tsdown'

export default defineConfig({
	deps: {
		alwaysBundle: /.+/v,
		neverBundle: ['electron'],
	},
	dts: false,
	fixedExtension: false,
	minify: true,
	platform: 'node',
	publint: true,
})
