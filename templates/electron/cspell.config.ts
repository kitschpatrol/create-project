import { cspellConfig } from '@kitschpatrol/cspell-config'

export default cspellConfig({
	// Electron build output dirs are not covered by case-police's default
	// `**/dist/**` ignore glob
	ignorePaths: ['**/dist-electron/**', '**/release/**'],
})
