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
	process.env.CI === undefined ? os.tmpdir() : '../..',
	'tmp',
)

// Vitest's per-hook/test timeout can't interrupt a synchronous execSync, so a
// stuck child (notably a hung `pnpm install` on Windows) would otherwise run
// out the entire CI job budget. Give each command its own timeout (below the
// surrounding Vitest timeout) so a stuck step fails fast with its captured
// output instead of silently hanging the runner. The large maxBuffer avoids
// spurious ENOBUFS failures from verbose install logs.
const COMMAND_TIMEOUT_MS = 240_000
const COMMAND_MAX_BUFFER = 64 * 1024 * 1024

/**
 * Run a command in a generated project, failing fast with captured output.
 *
 * On error or timeout the command's stdout/stderr are logged before rethrowing,
 * so CI shows where a stuck or failing step got to instead of a black-box
 * hang.
 *
 * @param command - Command to run.
 * @param cwd - Working directory (the generated project).
 * @param label - Human-readable step name used in diagnostics.
 *
 * @returns The command's stdout.
 */
function runCommand(command: string, cwd: string, label: string): string {
	try {
		return execSync(command, {
			cwd,
			encoding: 'utf8',
			maxBuffer: COMMAND_MAX_BUFFER,
			stdio: 'pipe',
			timeout: COMMAND_TIMEOUT_MS,
		})
	} catch (error) {
		console.error(`${label} failed (command: ${command}):`)
		if (error instanceof Error && 'stdout' in error) {
			console.error('stdout:', (error as { stdout: string }).stdout)
		}

		if (error instanceof Error && 'stderr' in error) {
			console.error('stderr:', (error as { stderr: string }).stderr)
		}

		throw error
	}
}

describe('Template Generation and Build Tests', () => {
	afterAll(async () => {
		// Clean up temp files
		await fs.rm(temporaryBase, { force: true, recursive: true })
	})

	for (const templateType of TEMPLATE_TYPES) {
		// The electron template pulls electron-builder's large binary dependency
		// tree, whose `pnpm install` deterministically hangs on CI runners (it's
		// fine locally, even with a cold store). electron-builder also can't
		// package on CI, so there's little to validate there — skip it on CI.
		const skipOnCI = templateType === 'electron' && process.env.CI !== undefined

		describe.skipIf(skipOnCI)(`${templateType} template`, () => {
			let tempDirectory = ''

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
				runCommand('pnpm install', tempDirectory, `Install for ${templateType}`)
			}, 300_000) // 5 minute timeout for setup

			afterAll(async () => {
				// Clean up temporary directory after all tests
				if (tempDirectory !== '') {
					await fs.rm(tempDirectory, { force: true, recursive: true })
				}
			}, 60_000) // 1 minute timeout for cleanup (Windows is slow deleting node_modules)

			it('should generate project successfully', async () => {
				// Verify package.json exists
				const packageJsonPath = path.join(tempDirectory, 'package.json')
				await expect(fs.access(packageJsonPath)).resolves.toBeUndefined()

				const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8')) as {
					name: string
				}
				expect(packageJson.name).toBeDefined()

				// Dev-only lint overrides must be stripped from generated projects
				const eslintConfig = await fs.readFile(path.join(tempDirectory, 'eslint.config.ts'), 'utf8')
				expect(eslintConfig).not.toContain('Template-dev-only')
			})

			it('should build without errors', () => {
				const output = runCommand('pnpm run build', tempDirectory, `Build for ${templateType}`)
				expect(output).toBeDefined()
			}, 300_000) // 5 minute timeout for build

			it('should lint without errors', () => {
				const output = runCommand('pnpm run lint', tempDirectory, `Lint for ${templateType}`)
				expect(output).toBeDefined()
				expect(output).toContain('8 / 8 Commands Succeeded')
			}, 300_000) // 5 minute timeout for lint

			it('should test without errors', () => {
				const output = runCommand('pnpm run test', tempDirectory, `Test for ${templateType}`)
				expect(output).toBeDefined()
			}, 300_000) // 5 minute timeout for test
		})
	}
})
