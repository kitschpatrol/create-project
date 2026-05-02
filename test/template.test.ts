import { runTemplate } from 'bingo'
import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import template, { TEMPLATE_TYPES } from '../src/template'

// Windows tmpdir issues on CI, we use a local temp directory. We have to go up
// a directory to avoid the monorepo illusion in linting tools.
const temporaryBase = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	process.env.CI ? '../..' : os.tmpdir(),
	'tmp',
)

describe('Template Generation and Build Tests', () => {
	afterAll(async () => {
		// Clean up temp files
		await fs.rm(temporaryBase, { force: true, recursive: true })
	})

	for (const templateType of TEMPLATE_TYPES) {
		describe(`${templateType} template`, () => {
			let tempDirectory: string

			beforeAll(async () => {
				// Create temporary directory under project-local tmp/
				await fs.mkdir(temporaryBase, { recursive: true })
				tempDirectory = await fs.mkdtemp(path.join(temporaryBase, `test-${templateType}-`))

				// Generate project using the template
				await runTemplate(template, {
					directory: tempDirectory,
					mode: 'setup',
					offline: true,
					options: {
						'author-email': 'test@example.com',
						'author-name': 'Test Author',
						'author-url': 'https://example.com',
						'cli-command-name': 'test-cli',
						'github-owner': 'test-owner',
						'github-repository': `test-${templateType.replace('+', '-')}`,
						'npm-auth-command': "echo 'test-auth'",
						type: templateType,
					},
				})

				// Install dependencies once for all tests
				try {
					execSync('pnpm install', {
						cwd: tempDirectory,
						encoding: 'utf8',
						stdio: 'pipe',
					})
				} catch (error) {
					console.error(`Failed to install dependencies for ${templateType}:`, error)
					throw error
				}
			}, 300_000) // 5 minute timeout for setup

			afterAll(async () => {
				// Clean up temporary directory after all tests
				if (tempDirectory) {
					await fs.rm(tempDirectory, { force: true, recursive: true })
				}
			}, 60_000) // 1 minute timeout for cleanup (Windows is slow deleting node_modules)

			it('should generate project successfully', async () => {
				// Verify package.json exists
				const packageJsonPath = path.join(tempDirectory, 'package.json')
				await expect(fs.access(packageJsonPath)).resolves.toBeUndefined()

				// eslint-disable-next-line ts/no-unsafe-type-assertion
				const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8')) as {
					name: string
				}
				expect(packageJson.name).toBeDefined()
			})

			it('should build without errors', () => {
				// For the electron template in CI, only run vite build (skip
				// electron-builder packaging, which downloads large platform-specific
				// tools and is too slow for CI).
				const buildCommand =
					templateType === 'electron' && process.env.CI ? 'pnpm exec vite build' : 'pnpm run build'

				try {
					const output = execSync(buildCommand, {
						cwd: tempDirectory,
						encoding: 'utf8',
						stdio: 'pipe',
					})
					expect(output).toBeDefined()
				} catch (error) {
					console.error(`Build failed for ${templateType}:`)
					if (error instanceof Error && 'stdout' in error) {
						// eslint-disable-next-line ts/no-unsafe-type-assertion
						console.error('stdout:', (error as { stdout: string }).stdout)
					}

					if (error instanceof Error && 'stderr' in error) {
						// eslint-disable-next-line ts/no-unsafe-type-assertion
						console.error('stderr:', (error as { stderr: string }).stderr)
					}

					throw error
				}
			}, 300_000) // 5 minute timeout for build

			it('should lint without errors', () => {
				// Run lint
				try {
					const output = execSync('pnpm run lint', {
						cwd: tempDirectory,
						encoding: 'utf8',
						stdio: 'pipe',
					})
					expect(output).toBeDefined()
					expect(output).toContain('8 / 8 Commands Succeeded')
				} catch (error) {
					console.error(`Lint failed for ${templateType}:`)
					if (error instanceof Error && 'stdout' in error) {
						// eslint-disable-next-line ts/no-unsafe-type-assertion
						console.error('stdout:', (error as { stdout: string }).stdout)
					}

					if (error instanceof Error && 'stderr' in error) {
						// eslint-disable-next-line ts/no-unsafe-type-assertion
						console.error('stderr:', (error as { stderr: string }).stderr)
					}

					throw error
				}
			}, 300_000) // 5 minute timeout for lint

			it.skip('should test without errors', () => {
				try {
					const output = execSync('pnpm run test', {
						cwd: tempDirectory,
						encoding: 'utf8',
						stdio: 'pipe',
					})
					expect(output).toBeDefined()
				} catch (error) {
					console.error(`Test failed for ${templateType}:`)
					if (error instanceof Error && 'stdout' in error) {
						// eslint-disable-next-line ts/no-unsafe-type-assertion
						console.error('stdout:', (error as { stdout: string }).stdout)
					}

					if (error instanceof Error && 'stderr' in error) {
						// eslint-disable-next-line ts/no-unsafe-type-assertion
						console.error('stderr:', (error as { stderr: string }).stderr)
					}

					throw error
				}
			}, 300_000) // 5 minute timeout for test
		})
	}
})
