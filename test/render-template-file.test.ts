import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderTemplateFile } from '../src/render-template-file'

describe('Template file rendering', () => {
	let directory: string

	beforeEach(async () => {
		directory = await fs.mkdtemp(path.join(os.tmpdir(), 'render-template-'))
	})

	afterEach(async () => {
		await fs.rm(directory, { force: true, recursive: true })
	})

	it('preserves raw placeholders and escapes ordinary expressions', async () => {
		const file = path.join(directory, 'template.txt')
		await fs.writeFile(file, '{{{name}}}\n{{name}}\n{{missing}}', { mode: 0o644 })
		await expect(renderTemplateFile(file, { name: '<project> & friends' })).resolves.toBe(
			'<project> & friends\n&lt;project&gt; &amp; friends\n',
		)
	})

	it.skipIf(process.platform === 'win32')('preserves executable metadata', async () => {
		const file = path.join(directory, 'script.sh')
		await fs.writeFile(file, '#!/bin/sh\necho {{{message}}}\n', { mode: 0o755 })
		await expect(renderTemplateFile(file, { message: 'hello' })).resolves.toEqual([
			'#!/bin/sh\necho hello\n',
			{ executable: true },
		])
	})

	it('rejects missing files and directories', async () => {
		await expect(renderTemplateFile(path.join(directory, 'missing'), {})).rejects.toThrow(
			'Expected a template file',
		)
		await expect(renderTemplateFile(directory, {})).rejects.toThrow('Expected a template file')
	})
})
