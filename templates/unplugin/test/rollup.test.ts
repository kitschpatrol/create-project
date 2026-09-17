import { globSync } from 'node:fs'
import path from 'node:path'
import { rollup } from 'rollup'
import { describe, expect, it } from 'vitest'
import starter from '../src/rollup'

const fixturesDirectory = path.resolve(import.meta.dirname, 'fixtures')
const fixtures = globSync('*.js', { cwd: fixturesDirectory })

describe('rollup', () => {
	for (const fixture of fixtures) {
		it(fixture, async () => {
			const bundle = await rollup({
				input: path.join(fixturesDirectory, fixture),
				plugins: [starter()],
			})
			try {
				const { output } = await bundle.generate({ format: 'es' })
				const snapshot = output
					.map((file) => {
						const content = file.type === 'chunk' ? file.code : '[BINARY]'
						return `// ${file.fileName}\n${content}`
					})
					.toSorted()
					.join('\n')
				expect(snapshot).toMatchSnapshot()
			} finally {
				await bundle.close()
			}
		})
	}
})
