import { defineConfig } from 'tsdown'

export default defineConfig({
	deps: {
		neverBundle: ['electron'],
	},
	dts: false,
	fixedExtension: false,
	minify: true,
	platform: 'node',
	publint: true,
})
