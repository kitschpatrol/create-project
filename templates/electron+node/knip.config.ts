import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: [
		'electron-builder.ts',
		'electron.vite.config.ts',
		'electron/main.ts',
		'electron/preload.ts',
	],
})
