import { defineConfig } from 'tsdown'

export default defineConfig([
	// CLI tool
	{
		deps: {
			neverBundle: ['electron'],
		},
		dts: false,
		entry: 'src/bin/cli.ts',
		fixedExtension: false,
		minify: true,
		outDir: 'dist/bin',
		platform: 'node',
	},
	// Library
	{
		attw: {
			profile: 'esm-only',
		},
		entry: 'src/lib/index.ts',
		fixedExtension: false,
		minify: false,
		outDir: 'dist/lib',
		platform: 'neutral',
		publint: true,
		tsconfig: 'tsconfig.build.json',
	},
])

// Alternative: Replace the configuration above with this single build when both
// the CLI and library target Node.js. Implementation chunks are shared in dist,
// and runtime dependencies remain external. Distribute the entire dist directory
// with installed dependencies; each build cleans all of dist.
// export default defineConfig({
// 	attw: {
// 		profile: 'esm-only',
// 	},
// 	entry: {
// 		'bin/cli': 'src/bin/cli.ts',
// 		'lib/index': 'src/lib/index.ts',
// 	},
// 	fixedExtension: false,
// 	minify: false,
// 	outDir: 'dist',
// 	platform: 'node',
// 	publint: true,
// 	tsconfig: 'tsconfig.build.json',
// })
