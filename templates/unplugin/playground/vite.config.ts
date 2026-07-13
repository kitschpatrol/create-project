import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	plugins: [process.env.CI === undefined ? mkcert() : undefined, inspect()],
	server: {
		hmr: {
			host: 'localhost',
			protocol: 'wss',
		},
		open: true,
	},
})
