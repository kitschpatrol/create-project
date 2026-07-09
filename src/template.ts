/* eslint-disable node/no-unsupported-features/node-builtins */

import { createTemplate } from 'bingo'
import { intakeDirectory } from 'bingo-fs'
import { handlebars } from 'bingo-handlebars'
import path from 'node:path'
import { z } from 'zod'

export const TEMPLATE_TYPES = [
	'minimal',
	'web',
	'cli',
	'library',
	'cli+library',
	'electron',
	'unplugin',
] as const

const LOCK_FILES_REGEX = /node_modules|pnpm-lock\.yaml/v

/**
 * Removes line ranges delimited by `Template-dev-only-start` and
 * `Template-dev-only-end` comments, inclusive of the marker lines.
 */
function stripTemplateDevOnlyBlocks(source: string): string {
	return source.replaceAll(
		/^[ \t]*\/\/ Template-dev-only-start.*?Template-dev-only-end[^\n]*\n/gmsv,
		'',
	)
}

export default createTemplate({
	about: {
		description:
			"Create a new TypeScript library, CLI, or web project with Kitschpatrol's shared configuration.",
		name: 'Create Kitschpatrol Project',
		// Show template origin in GitHub... don't want this right now
		// repository: {
		// 	owner: 'kitschpatrol',
		// 	repository: 'https://github.com/kitschpatrol/create-project',
		// },
	},
	options: {
		/* eslint-disable perfectionist/sort-objects */
		type: z.enum(TEMPLATE_TYPES).default('minimal').describe('The type of project to create'),
		'author-name': z.string().default('Eric Mika').describe('The name of the author'),
		'author-email': z.string().default('eric@ericmika.com').describe('The email of the author'),
		'author-url': z.string().default('https://ericmika.com').describe('The URL of the author'),
		'cli-command-name': z
			.string()
			.default('new-project')
			.describe('CLI command name (if applicable)'),
		'github-owner': z.string().default('kitschpatrol').describe('The owner of the repository'),
		'github-repository': z
			.string()
			.default(`new-project`)
			.describe('The name of the repository / package'),
		'npm-auth-command': z
			.string()
			.default("op read 'op://Personal/npm/token'")
			.describe(
				'A shell command that sets the NPM_AUTH_TOKEN env variable with a granular token for publishing to npm',
			),
		/* eslint-enable perfectionist/sort-objects */
	},
	async produce({ options }) {
		// Add some calculated options to the template
		const extraOptions = {
			...options,
			year: new Date().getFullYear(),
		}

		async function handlebarsHelper(...paths: string[]) {
			const result: Record<string, Awaited<ReturnType<typeof handlebars>>> = {}
			for (const filePath of paths) {
				result[filePath] = await handlebars(
					path.join(import.meta.dirname, `../templates/${options.type}/${filePath}`),
					extraOptions,
				)
			}

			return result
		}

		const templateFiles = await intakeDirectory(
			path.join(import.meta.dirname, `../templates/${options.type}`),
			{ exclude: LOCK_FILES_REGEX },
		)

		// `npm-packlist` hardcodes `.gitignore` to be excluded from published
		// packages, so the source files are stored as `_gitignore` and renamed back
		// here.
		if (templateFiles._gitignore) {
			templateFiles['.gitignore'] = templateFiles._gitignore
			delete templateFiles._gitignore
		}

		// Lint rule overrides between `Template-dev-only` markers silence
		// placeholder-value errors when the templates are linted inside this repo,
		// and must not ship in generated projects.
		const eslintConfigEntry = templateFiles['eslint.config.ts']
		if (Array.isArray(eslintConfigEntry) && typeof eslintConfigEntry[0] === 'string') {
			eslintConfigEntry[0] = stripTemplateDevOnlyBlocks(eslintConfigEntry[0])
		}

		return {
			files: {
				...templateFiles,
				...(await handlebarsHelper(
					'license.txt',
					'package.json',
					// Per-template handlebars file expansion. Add any file that
					// contains {{{...}}} placeholders here.
					...(options.type === 'electron' || options.type === 'web' ? ['index.html'] : []),
					...(options.type === 'unplugin'
						? [
								'playground/index.html',
								'playground/package.json',
								'src/bun.ts',
								'src/esbuild.ts',
								'src/farm.ts',
								'src/index.ts',
								'src/rolldown.ts',
								'src/rollup.ts',
								'src/rspack.ts',
								'src/vite.ts',
								'src/webpack.ts',
								'test/__snapshots__/rollup.test.ts.snap',
							]
						: []),
				)),
			},
			scripts: [
				{
					commands:
						options.type === 'electron'
							? ['pnpm install', 'pnpm run fix']
							: ['pnpm install', 'pnpm run build', 'pnpm run fix'],
					phase: 0,
					silent: true,
				},
				// TODO: This runs before initial commit, needs to run after...
				// {
				// 	commands: ["git commit --amend -m 'Initial commit.'"],
				// 	phase: 1,
				// },
			],
			suggestions: ["git commit --amend -m 'Initial commit.'"],
		}
	},
})
