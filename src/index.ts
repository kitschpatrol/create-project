#!/usr/bin/env node

import { runTemplateCLI } from 'bingo'
import template from './template'

// Bingo builds its "run again" tip from the basename of process.argv[1],
// which under pnpm's shell-shim bins is the real script path, producing
// `npx index.js`. Rewrite it to the canonical invocation on the way out.
// See getRerunCommand in https://github.com/bingo-js/bingo
const originalWrite = process.stdout.write.bind(process.stdout)
process.stdout.write = ((...args: Parameters<typeof process.stdout.write>) => {
	if (typeof args[0] === 'string') {
		args[0] = args[0].replace('npx index.js', 'pnpm create @kitschpatrol/project@latest')
	}

	return originalWrite(...args)
}) as typeof process.stdout.write

// @ts-expect-error - Bingo's runTemplateCLI should be generic like runTemplate?
process.exitCode = await runTemplateCLI(template)
