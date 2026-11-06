import { cspellConfig } from '@kitschpatrol/cspell-config'

export default cspellConfig({
	ignorePaths: ['**/changelog.md'],
	words: [
		'chagent',
		// Regex flags in src/template.ts
		'gmsv',
	],
})
