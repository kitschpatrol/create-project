import { defineConfig } from '@kitschpatrol/electron-vite'

export default defineConfig({
	main: {
		build: {
			externalizeDeps: true,
			lib: { entry: 'electron/main.ts' },
			sourcemap: 'inline',
		},
	},
	preload: {
		build: {
			// The sandboxed preload can only `require` Electron built-ins, so
			// dependencies must be bundled in
			externalizeDeps: false,
			lib: { entry: 'electron/preload.ts', formats: ['cjs'] },
			sourcemap: 'inline',
		},
	},
	renderer: {
		build: {
			rollupOptions: { input: 'index.html' },
		},
		root: '.',
	},
})
