import { defineConfig } from 'tsdown'

export default defineConfig({
	deps: {
		onlyBundle: [],
	},
	entry: ['./src/*.ts'],
	fixedExtension: false,
})
