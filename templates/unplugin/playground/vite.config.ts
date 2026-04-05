import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'

process.env.BROWSER = 'chromium'

export default defineConfig({
	plugins: [mkcert(), inspect()],
	server: {
		hmr: {
			host: 'localhost',
			protocol: 'wss',
		},
		open: true,
	},
})
