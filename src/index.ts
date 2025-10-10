#!/usr/bin/env node

import { runTemplateCLI } from 'bingo'
import template from './template'

process.exitCode = await runTemplateCLI(template, {
	name: 'new-project',
	version: '0.0.0',
})
