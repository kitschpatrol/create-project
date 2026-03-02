import { defineConfig } from 'tsdown'

export default defineConfig({
	dts: false,
	entry: 'src/bin/cli.ts',
	fixedExtension: false,
	minify: true,
	noExternal: /.+/,
	outDir: 'dist/bin',
	platform: 'node',
	publint: true,
})
