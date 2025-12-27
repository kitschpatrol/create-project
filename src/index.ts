#!/usr/bin/env node

import { runTemplateCLI } from 'bingo'
import template from './template'

// @ts-expect-error - Bingo's runTemplateCLI should be generic like runTemplate?
process.exitCode = await runTemplateCLI(template)
