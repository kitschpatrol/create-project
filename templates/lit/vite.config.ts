import { defineConfig } from 'vitest/config'

// Vite serves `index.html` as a development playground for the component. The
// distributable build is handled by tsdown, see `tsdown.config.ts`.
export default defineConfig({
	server: {
		open: true,
	},
	test: {
		environment: 'happy-dom',
	},
})
