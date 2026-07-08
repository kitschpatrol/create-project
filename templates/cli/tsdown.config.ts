import { defineConfig } from 'tsdown'

export default defineConfig({
	deps: {
		alwaysBundle: /.+/v,
	},
	dts: false,
	fixedExtension: false,
	minify: true,
	platform: 'node',
	publint: true,
})
