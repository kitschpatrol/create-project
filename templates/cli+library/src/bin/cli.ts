#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { version, bin } from '../../package.json'

import { doSomething, doSomethingElse } from '../lib'

const cliCommandName = Object.keys(bin).at(0)!
const yargsInstance = yargs(hideBin(process.argv))

// yes
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
		() => {},
		async () => {
			process.stdout.write(doSomething())
		},
	)
	.command(
		'do-something-else',
		'Run the do-something-else command.',
		() => {},
		async () => {
			process.stdout.write(doSomethingElse())
		},
	)
	.alias('h', 'help')
	.version(version)
	.alias('v', 'version')
	.help()
	.strict()
	.wrap(process.stdout.isTTY ? Math.min(120, yargsInstance.terminalWidth()) : 0)
	.parse()
