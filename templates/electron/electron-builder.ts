/* eslint-disable no-template-curly-in-string */
/* eslint-disable perfectionist/sort-objects */
import type { Configuration } from 'electron-builder'

const config: Configuration = {
	appId: 'YourAppID',
	artifactName: '${productName}_${version}-${os}-${arch}.${ext}',
	copyright: 'Copyright © Someone',
	extraMetadata: { name: 'App Name' },
	linux: { icon: 'electron/resources/icons/png/1024x1024.png', target: 'tar.gz' },
	files: ['dist', 'dist-electron'],
	mac: {
		category: 'public.app-category.education',
		entitlements: 'electron/resources/mac/entitlements.mac.plist',
		entitlementsInherit: 'electron/resources/mac/entitlements.mac.plist',
		gatekeeperAssess: false,
		hardenedRuntime: true,
		// Delete this when you're ready to sign the app
		identity: null,
		icon: 'electron/resources/icons/mac/icon.icns',
		target: 'zip',
	},
	nsis: {
		allowToChangeInstallationDirectory: true,
		deleteAppDataOnUninstall: false,
		oneClick: false,
		perMachine: false,
	},
	productName: 'YourAppName',
	publish: { provider: 'github', releaseType: 'release', vPrefixedTagName: true },
	win: {
		icon: 'electron/resources/icons/win/icon.ico',
		target: [
			{
				arch: ['x64'],
				target: 'nsis',
			},
		],
	},
}

export default config
