import type { CreatedFileEntry } from 'bingo-fs'
import { intake } from 'bingo-fs'
import Handlebars from 'handlebars'

/**
 * Render a template file while preserving Bingo's executable-file metadata.
 */
export async function renderTemplateFile(
	sourcePath: string,
	options: Record<string, unknown>,
): Promise<CreatedFileEntry> {
	const source = await intake(sourcePath)
	if (!Array.isArray(source)) {
		throw new TypeError(`Expected a template file at '${sourcePath}'.`)
	}

	const contents = Handlebars.compile(source[0])(options)
	return source[1]?.executable ? [contents, { executable: true }] : contents
}
