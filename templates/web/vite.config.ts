import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	plugins: [process.env.CI === undefined ? mkcert() : undefined],
	server: {
		open: true,
	},
})
