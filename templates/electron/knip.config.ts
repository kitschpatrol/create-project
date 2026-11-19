import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['electron-builder.ts', 'electron/preload.ts', 'electron/main.ts'],
	ignoreDependencies: [
		'@kitschpatrol/chagent', // Invoked through bumpp's --execute argument.
	],
})
