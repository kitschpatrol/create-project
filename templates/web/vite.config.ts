import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// The site is served from a subdirectory matching the repository name, so the
// build output is nested to match. See `wrangler.jsonc` and the readme.
const base = '/{{{github-repository}}}/'

export default defineConfig({
	base,
	build: {
		outDir: `dist${base}`,
	},
	plugins: [
		process.env.CI === undefined ? mkcert() : undefined,
		{
			// Match Cloudflare's `drop-trailing-slash` handling during development.
			configureServer(server) {
				server.middlewares.use((request, _response, next) => {
					const url = new URL(request.url ?? '/', 'http://localhost')
					if (url.pathname === base.slice(0, -1)) {
						request.url = `${base}${url.search}`
					}

					next()
				})
			},
			name: 'home-without-trailing-slash',
		},
	],
	server: {
		open: true,
	},
})
