#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { bin, version } from '../package.json'

const cliCommandName = Object.keys(bin).at(0)!
const yargsInstance = yargs(hideBin(process.argv))

// Yes
await yargsInstance
	.scriptName(cliCommandName)
	.usage('$0 [command]', `Run a ${cliCommandName} command.`)
	.option('verbose', {
		description: 'Run with verbose logging',
		type: 'boolean',
	})
	.command(
		['$0', 'do-something'],
		'Run the do-something command.',
		() => {
			// Options go here
		},
		() => {
			process.stdout.write('Did something!\n')
		},
	)
	.command(
		'do-something-else',
		'Run the do-something-else command.',
		() => {
			// Options go here
		},
		() => {
			process.stdout.write('Did something else!\n')
		},
	)
	.alias('h', 'help')
	.version(version)
	.alias('v', 'version')
	.help()
	.strict()
	.wrap(process.stdout.isTTY ? Math.min(120, yargsInstance.terminalWidth()) : 0)
	.parse()
