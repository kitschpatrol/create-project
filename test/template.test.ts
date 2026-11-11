import type { BaselineData } from 'vitest'
import type { JsonTestResults } from 'vitest/node'
import { runTemplate } from 'bingo'
import { execSync, spawn } from 'node:child_process'
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
const NODE_SHEBANG_REGEX = /^#!\/usr\/bin\/env node\n/v
const YARGS_IMPORT_REGEX = /\bfrom\s*['"]yargs['"]/v
const LOGNOW_IMPORT_REGEX = /\bfrom\s*['"]lognow['"]/v
const TWEAKPANE_CORE_IMPORT_REGEX = /\bfrom\s*['"]@tweakpane\/core['"]/v

// These commands run nested inside the outer `pnpm run test`, whose pnpm has
// already stamped `npm_lifecycle_event` and friends into our environment.
// pnpm 12 passes those inherited stamps through to the scripts it runs and,
// on Windows, differently cased spellings collapse at spawn time with an
// unpredictable winner, so a generated project's script could see the outer
// `test` value instead of its own. That silently disabled `bench:baseline`
// (its baseline file was never written). Drop the inherited `npm_*` variables
// so each command runs as it would from a fresh shell.
const COMMAND_ENV = Object.fromEntries(
	Object.entries(process.env).filter(([key]) => !key.toLowerCase().startsWith('npm_')),
)

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
			env: COMMAND_ENV,
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

// Watch rebuilds briefly remove old chunks, so retry missing files on the next poll.
async function readBuiltJavaScript(directory: string): Promise<string[]> {
	try {
		const files = await fs.readdir(directory)
		const results = await Promise.allSettled(
			files
				.filter((file) => file.endsWith('.js'))
				.map(async (file) => fs.readFile(path.join(directory, file), 'utf8')),
		)
		return results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
	} catch {
		return []
	}
}

describe('Template Generation and Build Tests', () => {
	afterAll(async () => {
		// Clean up temp files
		await fs.rm(temporaryBase, { force: true, recursive: true })
	})

	for (const templateType of TEMPLATE_TYPES) {
		// The electron templates pull electron-builder's large binary dependency
		// tree, whose `pnpm install` deterministically hangs on CI runners (it's
		// fine locally, even with a cold store). electron-builder also can't
		// package on CI, so there's little to validate there — skip them on CI.
		const skipOnCI = templateType.startsWith('electron') && process.env.CI !== undefined

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
						'github-token-command': "echo 'test-token'",
						'npm-otp-command': "echo 'test-otp'",
						'npm-token-command': "echo 'test-auth'",
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

				// Agent skills are linked by pnpm during install, per the `permissions`
				// and `skills` settings in the generated pnpm-workspace.yaml
				for (const skillsDirectory of ['.agents/skills', '.claude/skills']) {
					// Version 12.18 of pnpm uses the skill's name; 12.16 prefixes it with the package.
					const skills = await fs.readdir(path.join(tempDirectory, skillsDirectory))
					const skill = skills.find(
						(name) => name === 'ksc' || name === 'pnpm-@kitschpatrol+shared-config-ksc',
					)
					expect(skill).toBeDefined()
					const contents = await fs.readFile(
						path.join(tempDirectory, skillsDirectory, skill!, 'SKILL.md'),
						'utf8',
					)
					expect(contents).toContain('ksc')
				}

				// Dev-only lint overrides must be stripped from generated projects
				const eslintConfig = await fs.readFile(path.join(tempDirectory, 'eslint.config.ts'), 'utf8')
				expect(eslintConfig).not.toContain('Template-dev-only')

				// Dot-directory boilerplate must make it into generated projects
				for (const dotFile of [
					'.github/workflows/check-links.yml',
					'.gitignore',
					'.vscode/tasks.json',
				]) {
					await expect(fs.access(path.join(tempDirectory, dotFile))).resolves.toBeUndefined()
				}
			})

			it('should build without errors', () => {
				const output = runCommand('pnpm run build', tempDirectory, `Build for ${templateType}`)
				expect(output).toBeDefined()
			}, 300_000) // 5 minute timeout for build

			if (templateType === 'tweakpane-plugin') {
				const distributions = [
					'test-tweakpane-plugin.js',
					'test-tweakpane-plugin.min.js',
					'test-tweakpane-plugin.lite.js',
					'test-tweakpane-plugin.lite.min.js',
				]

				it('should package usable bundled and lite plugin distributions', async () => {
					const demo = await fs.readFile(path.join(tempDirectory, 'demo/index.html'), 'utf8')
					expect(demo).toContain('<title>test-tweakpane-plugin</title>')
					expect(demo).toContain("from '../src/index.ts'")
					await expect(fs.access(path.join(tempDirectory, 'index.html'))).rejects.toThrow()
					const outputFiles = await fs.readdir(path.join(tempDirectory, 'dist'), {
						recursive: true,
					})
					expect(outputFiles.some((file) => file.endsWith('.css'))).toBe(false)
					expect(outputFiles.some((file) => file.endsWith('.map'))).toBe(false)
					expect(outputFiles.filter((file) => file.endsWith('.js'))).toHaveLength(4)
					expect(outputFiles.filter((file) => file.endsWith('.d.ts'))).toEqual([
						'test-tweakpane-plugin.d.ts',
					])
					for (const file of distributions) {
						expect(outputFiles).toContain(file)
						const source = await fs.readFile(path.join(tempDirectory, 'dist', file), 'utf8')
						expect(TWEAKPANE_CORE_IMPORT_REGEX.test(source)).toBe(file.includes('.lite.'))
						expect(source).not.toContain('sourceMappingURL=')
					}

					expect(outputFiles).not.toContain('lite')
					const declarations = await fs.readFile(
						path.join(tempDirectory, 'dist/test-tweakpane-plugin.d.ts'),
						'utf8',
					)
					expect(declarations).toMatch(TWEAKPANE_CORE_IMPORT_REGEX)
					expect(declarations).toContain('TextInputParams')
					expect(declarations).not.toContain('?inline')

					const packed = JSON.parse(
						runCommand(
							'pnpm pack --ignore-scripts --json --loglevel error',
							tempDirectory,
							'Pack Tweakpane plugin',
						),
					) as { files: Array<{ path: string }> }
					const packedFiles = packed.files.map((file) => file.path)
					const builtFiles = outputFiles.filter(
						(entry) => entry.endsWith('.js') || entry.endsWith('.d.ts'),
					)
					for (const file of builtFiles) {
						expect(packedFiles).toContain(`dist/${file.split(path.sep).join('/')}`)
					}

					expect(packedFiles.some((file) => file.startsWith('src/'))).toBe(false)
					expect(packedFiles.some((file) => file.endsWith('.map'))).toBe(false)
					const smokePath = path.join(tempDirectory, 'check-plugin.mjs')
					try {
						await fs.writeFile(
							smokePath,
							`import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
// Both public exports must load without a browser or stylesheet loader.
assert.equal(typeof globalThis.document, 'undefined')
const bundled = await import('test-tweakpane-plugin')
const lite = await import('test-tweakpane-plugin/lite')
const bundledMin = await import('./dist/test-tweakpane-plugin.min.js')
const liteMin = await import('./dist/test-tweakpane-plugin.lite.min.js')
const require = createRequire(import.meta.url)
assert.deepEqual(Object.keys(require('test-tweakpane-plugin/package.json').exports), ['.', './lite', './package.json'])
assert.throws(() => require.resolve('test-tweakpane-plugin/dist/test-tweakpane-plugin.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' })
assert.equal(require('test-tweakpane-plugin').plugins, bundled.plugins)
assert.equal(require('test-tweakpane-plugin/lite').plugins, lite.plugins)
assert.equal(typeof globalThis.document, 'undefined')
assert.equal(bundled.id, 'test-tweakpane-plugin')
assert.equal(bundled.css, lite.css)
assert.equal(typeof bundled.css, 'string')
assert.ok(bundled.css.includes('.tp-textinputv'))
assert.ok(!bundled.css.includes('@use'))
assert.ok(!bundled.css.includes('__css__'))
const { Window } = await import('happy-dom')
const window = new Window()
globalThis.window = window
globalThis.document = window.document
globalThis.HTMLElement = window.HTMLElement
const { Pane } = await import('tweakpane')
try {
  for (const plugin of [bundled, bundledMin, lite, liteMin]) {
    assert.equal(plugin.css, bundled.css)
    assert.equal(plugin.id, bundled.id)
    assert.deepEqual(Object.keys(plugin), Object.keys(bundled))
    const pane = new Pane({ document: window.document })
    try {
      pane.registerPlugin(plugin)
      const params = { message: 'Hello' }
      const binding = pane.addBinding(params, 'message', { view: 'text-input' })
      const input = binding.element.querySelector('input')
      assert.ok(input)
      assert.equal(input.value, 'Hello')
      input.value = 'Published plugin works'
      input.dispatchEvent(new window.Event('input', { bubbles: true }))
      assert.equal(params.message, 'Published plugin works')
      assert.ok(window.document.head.textContent.includes('.tp-textinputv'))
    } finally {
      pane.dispose()
    }
  }
} finally {
  await window.happyDOM.close()
}
`,
						)
						runCommand('node check-plugin.mjs', tempDirectory, 'Import and register built plugins')
					} finally {
						await fs.rm(smokePath, { force: true })
					}
				}, 300_000)

				it('should rebuild all four distributions when a Sass partial changes', async () => {
					const stylesheetPath = path.join(tempDirectory, 'src/styles/plugin.scss')
					const partialPath = path.join(tempDirectory, 'src/styles/_watch-test.scss')
					const original = await fs.readFile(stylesheetPath, 'utf8')
					await fs.writeFile(partialPath, '.tp-watch-test { --watch-test: initial-watch-token; }\n')
					await fs.writeFile(stylesheetPath, `@use './watch-test';\n${original}`)

					// Launch Node directly so cleanup also works on Windows without a shell process tree.
					const watcher = spawn(
						process.execPath,
						[path.join(tempDirectory, 'node_modules/tsdown/dist/run.mjs'), '--watch'],
						{ cwd: tempDirectory, env: COMMAND_ENV, stdio: ['ignore', 'pipe', 'pipe'] },
					)
					let output = ''
					let spawnError: Error | undefined
					const capture = (chunk: string) => {
						output = `${output}${chunk}`.slice(-8000)
					}

					watcher.stdout.setEncoding('utf8').on('data', capture)
					watcher.stderr.setEncoding('utf8').on('data', capture)
					watcher.on('error', (error) => {
						spawnError = error
					})
					const closed = new Promise<void>((resolve) => {
						watcher.once('close', () => {
							resolve()
						})
					})

					async function hasCssToken(token: string): Promise<boolean> {
						if (spawnError) {
							throw spawnError
						}

						if (watcher.exitCode !== null) {
							throw new Error(`Watcher exited: ${output}`)
						}

						const contents = await readBuiltJavaScript(path.join(tempDirectory, 'dist'))
						return (
							contents.length === distributions.length &&
							contents.every((source) => source.includes(token))
						)
					}

					try {
						await expect
							.poll(async () => hasCssToken('initial-watch-token'), { timeout: 30_000 })
							.toBe(true)
						await fs.writeFile(
							partialPath,
							'.tp-watch-test { --watch-test: updated-watch-token; }\n',
						)
						await expect
							.poll(async () => hasCssToken('updated-watch-token'), { timeout: 30_000 })
							.toBe(true)
						for (const file of [
							...distributions.map((file) => `dist/${file}`),
							'dist/test-tweakpane-plugin.d.ts',
						]) {
							await expect(fs.access(path.join(tempDirectory, file))).resolves.toBeUndefined()
						}
					} catch (error) {
						throw new Error(`Tweakpane Sass watch failed:\n${output}`, { cause: error })
					} finally {
						watcher.kill()
						const killTimeout = setTimeout(() => {
							watcher.kill('SIGKILL')
						}, 5000)
						killTimeout.unref()
						try {
							await closed
						} finally {
							clearTimeout(killTimeout)
							await fs.writeFile(stylesheetPath, original)
							await fs.rm(partialPath, { force: true })
						}

						runCommand(
							'pnpm run build',
							tempDirectory,
							'Restore Tweakpane plugin build after watch',
						)
					}
				}, 120_000)
			} else if (templateType === 'cli+library') {
				it('should clean and package CLI and library outputs', async () => {
					const staleFiles = ['dist/bin/stale.js', 'dist/lib/stale.js']
					for (const file of staleFiles) {
						await fs.writeFile(path.join(tempDirectory, file), '// Stale build output\n')
					}

					runCommand('pnpm run build', tempDirectory, 'Rebuild CLI and library')
					for (const file of staleFiles) {
						await expect(fs.access(path.join(tempDirectory, file))).rejects.toThrow()
					}

					const cli = await fs.readFile(path.join(tempDirectory, 'dist/bin/cli.js'), 'utf8')
					const library = await fs.readFile(path.join(tempDirectory, 'dist/lib/index.js'), 'utf8')
					expect(cli).toMatch(NODE_SHEBANG_REGEX)

					expect(cli).toMatch(YARGS_IMPORT_REGEX)
					expect(library).toMatch(LOGNOW_IMPORT_REGEX)

					const packed = JSON.parse(
						runCommand(
							'pnpm pack --ignore-scripts --json --loglevel error',
							tempDirectory,
							'Pack CLI and library',
						),
					) as {
						files: Array<{ path: string }>
					}
					const packedFiles = packed.files.map((file) => file.path)
					const outputFiles = await fs.readdir(path.join(tempDirectory, 'dist'), {
						recursive: true,
					})
					const builtFiles = outputFiles.filter(
						(file) => file.endsWith('.js') || file.endsWith('.d.ts'),
					)
					for (const file of builtFiles) {
						expect(packedFiles).toContain(`dist/${file.split(path.sep).join('/')}`)
					}

					expect(packedFiles).toContain('dist/lib/index.d.ts')
					await fs.writeFile(
						path.join(tempDirectory, 'check-library.mjs'),
						`import assert from 'node:assert/strict'
import { doSomething, doSomethingElse, setLogger } from 'test-cli-library'
setLogger()
assert.equal(doSomething(), 'Something happened')
assert.equal(doSomethingElse(), 'Something else happened')
`,
					)
					runCommand('node check-library.mjs', tempDirectory, 'Import built library')
					await fs.rm(path.join(tempDirectory, 'check-library.mjs'))
				}, 300_000)
			}

			it('should lint without errors', () => {
				const output = runCommand('pnpm run lint', tempDirectory, `Lint for ${templateType}`)
				expect(output).toBeDefined()
				expect(output).toContain('8 / 8 Commands Succeeded')
			}, 300_000) // 5 minute timeout for lint

			it('should test without errors', () => {
				const output = runCommand('pnpm run test', tempDirectory, `Test for ${templateType}`)
				expect(output).toBeDefined()
			}, 300_000) // 5 minute timeout for test

			// The minimal and Tweakpane plugin templates ship no benchmark.
			if (templateType !== 'minimal' && templateType !== 'tweakpane-plugin') {
				it('should run benchmarks and preserve a saved baseline', async () => {
					const baselinePath = path.join(tempDirectory, 'test/benchmarks/baseline.json')
					await expect(fs.access(baselinePath)).rejects.toThrow()
					runCommand('pnpm run bench', tempDirectory, `Benchmark for ${templateType}`)
					await expect(fs.access(baselinePath)).rejects.toThrow()

					const baselineOutput = runCommand(
						'pnpm run bench:baseline',
						tempDirectory,
						`Baseline for ${templateType}`,
					)
					await expect(
						fs.access(baselinePath),
						`bench:baseline did not write ${baselinePath}. Output:\n${baselineOutput}`,
					).resolves.toBeUndefined()
					const baseline = await fs.readFile(baselinePath, 'utf8')
					const result = JSON.parse(baseline) as BaselineData
					expect(result.throughput.mean).toBeGreaterThan(0)

					runCommand(
						'pnpm run bench --reporter=json --outputFile=test/benchmarks/comparison.json',
						tempDirectory,
						`Compare for ${templateType}`,
					)
					const report = JSON.parse(
						await fs.readFile(path.join(tempDirectory, 'test/benchmarks/comparison.json'), 'utf8'),
					) as JsonTestResults
					const benchmarks = report.testResults
						.flatMap((file) => file.assertionResults)
						.flatMap((test) => test.benchmarks)
						.flatMap((group) => group.tasks)
					expect(report.success).toBe(true)
					expect(benchmarks).toHaveLength(2)
					expect(benchmarks).toEqual(
						expect.arrayContaining([
							expect.objectContaining({ name: 'current' }),
							expect.objectContaining({ fromStore: true, name: 'baseline' }),
						]),
					)
					expect(await fs.readFile(baselinePath, 'utf8')).toBe(baseline)
				}, 300_000)
			}
		})
	}
})
