import { runTemplate } from 'bingo'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import template, { TEMPLATE_TYPES } from '../src/template'

describe('Template Generation and Build Tests', () => {
	for (const templateType of TEMPLATE_TYPES) {
		describe(`${templateType} template`, () => {
			let tempDirectory: string

			beforeAll(async () => {
				// Create temporary directory
				tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `test-${templateType}-`))

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
						'npm-auth-command': 'echo "test-auth"',
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
			}, 180_000) // 3 minute timeout for setup

			afterAll(() => {
				// Clean up temporary directory after all tests
				if (tempDirectory && fs.existsSync(tempDirectory)) {
					fs.rmSync(tempDirectory, { force: true, recursive: true })
				}
			})

			it('should generate project successfully', () => {
				// Verify package.json exists
				const packageJsonPath = path.join(tempDirectory, 'package.json')
				expect(fs.existsSync(packageJsonPath)).toBe(true)

				// eslint-disable-next-line ts/no-unsafe-type-assertion
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as { name: string }
				expect(packageJson.name).toBeDefined()
			})

			it('should build without errors', () => {
				// Run build
				try {
					const output = execSync('pnpm run build', {
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
			}, 120_000) // 2 minute timeout for build

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
			}, 120_000) // 2 minute timeout for lint
		})
	}
})
