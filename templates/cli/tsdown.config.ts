import { defineConfig } from 'tsdown'

export default defineConfig({
	deps: {
		alwaysBundle: /.+/,
	},
	dts: false,
	entry: 'src/bin/cli.ts',
	fixedExtension: false,
	minify: true,
	outDir: 'dist/bin',
	platform: 'node',
	publint: true,
})
