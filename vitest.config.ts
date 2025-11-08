import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['test/**/*.test.ts'],
		silent: 'passed-only', // Suppress console output during tests
	},
})
