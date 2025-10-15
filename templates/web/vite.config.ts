import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

process.env.BROWSER = 'chromium'

export default defineConfig({
	plugins: [mkcert()],
	server: {
		open: true,
	},
})
