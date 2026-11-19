import { cspellConfig } from '@kitschpatrol/cspell-config'

export default cspellConfig({
	ignorePaths: [
		// Chagent generates the changelog.
		'**/changelog.md',
		// Electron build output dirs are not covered by case-police's default
		// `**/dist/**` ignore glob
		'**/dist-electron/**',
		'**/release/**',
	],
	words: ['chagent'],
})
