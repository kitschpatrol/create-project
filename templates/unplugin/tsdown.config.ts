import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['./src/*.ts'],
	fixedExtension: false,
	inlineOnly: [],
})
