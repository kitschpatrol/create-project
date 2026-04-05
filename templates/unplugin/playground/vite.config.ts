import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'

process.env.BROWSER = 'chromium'

export default defineConfig({
	plugins: [inspect()],
	server: {
		hmr: {
			host: 'localhost',
			protocol: 'wss',
		},
		open: true,
	},
})
