/* eslint-disable node/no-unsupported-features/node-builtins */

import { createTemplate } from 'bingo'
import { intakeDirectory } from 'bingo-fs'
import { handlebars } from 'bingo-handlebars'
import path from 'node:path'
import { z } from 'zod'

export default createTemplate({
	about: {
		name: 'Kitschpatrol Create Project',
		// Show template origin in GitHub... don't want this right now
		// repository: {
		// 	owner: 'kitschpatrol',
		// 	repository: 'https://github.com/kitschpatrol/create-project',
		// },
	},
	options: {
		/* eslint-disable perfectionist/sort-objects */
		type: z
			.enum(['minimal', 'web', 'cli', 'library', 'cli+library'])
			.default('minimal')
			.describe('The type of project to create'),
		'author-name': z.string().default('Eric Mika').describe('The name of the author'),
		'author-email': z.string().default('eric@ericmika.com').describe('The email of the author'),
		'author-url': z.string().default('https://ericmika.com').describe('The URL of the author'),
		'cli-command-name': z
			.string()
			.default('new-project')
			.describe('CLI command name (if applicable)'),
		// "Future" prefix prevents Bingo from creating a GitHub repository
		// Pending resolution of https://github.com/bingo-js/bingo/issues/365
		'github-owner': z
			.string()
			.default('kitschpatrol')
			.describe('The owner of the future repository'),
		'github-repository': z
			.string()
			.default(`new-project`)
			.describe('The name of the future repository / package'),
		'npm-otp-command': z
			.string()
			.default("op read 'op://Personal/Npmjs/one-time password?attribute=otp'")
			.describe('A shell command that returns your one-time password for publishing to npm'),
		/* eslint-enable perfectionist/sort-objects */
	},
	async produce(params) {
		const { options } = params

		return {
			files: {
				...(await intakeDirectory(path.join(import.meta.dirname, `../templates/${options.type}`), {
					exclude: /node_modules|pnpm-lock\.yaml/,
				})),
				'license.txt': await handlebars(
					path.join(import.meta.dirname, `../templates/${options.type}/license.txt`),
					options,
				),
				'package.json': await handlebars(
					path.join(import.meta.dirname, `../templates/${options.type}/package.json`),
					options,
				),
			},
			scripts: [
				{
					commands: ['pnpm install', 'pnpm run build', 'pnpm run fix'],
					phase: 0,
					silent: true,
				},
				// TODO: This runs before initial commit, needs to run after...
				// {
				// 	commands: ["git commit --amend -m 'Initial commit.'"],
				// 	phase: 1,
				// },
			],
			suggestions: ["git commit --amend -m 'Initial commit.'"]
		}
	},
})
