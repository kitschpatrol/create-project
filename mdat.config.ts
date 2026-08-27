import { mdatConfig } from '@kitschpatrol/mdat-config'
import cliHelpPlugin from 'mdat-plugin-cli-help'

const { cli } = cliHelpPlugin

const BOX_GUTTER_REGEX = /^│ {0,2}/v

/**
 * Strip Clack's box-drawing frame from raw CLI help output, keeping only the
 * lines inside the box and dropping the header, footer, and status lines.
 *
 * @param helpText - Raw help output, as rendered by Clack
 *
 * @returns The unframed help text, with surrounding blank lines removed
 */
function trimClackFrame(helpText: string): string {
	const lines = helpText
		.split('\n')
		.filter((line) => line.startsWith('│'))
		.map((line) => line.replace(BOX_GUTTER_REGEX, '').trimEnd())

	while (lines.at(0) === '') {
		lines.shift()
	}

	while (lines.at(-1) === '') {
		lines.pop()
	}

	return lines.join('\n')
}

const cliHelpTrimmed: typeof cli = {
	async content(_options, context) {
		if (typeof cli !== 'object' || Array.isArray(cli) || typeof cli.content !== 'function') {
			throw new TypeError('Expected the cli rule to be an object with a content function')
		}

		const output = await cli.content({ parser: 'none' }, context)
		return `\`\`\`txt\n${trimClackFrame(output)}\n\`\`\``
	},
}

export default mdatConfig({
	'cli-help-trimmed': cliHelpTrimmed,
})
