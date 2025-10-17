/* eslint-disable ts/consistent-type-definitions */
/* eslint-disable ts/naming-convention */

declare namespace NodeJS {
	interface ProcessEnv {
		/**
		 * The built directory structure
		 *
		 * ```tree
		 * ├─┬ dist
		 * │ ├─┬ electron
		 * │ │ ├── main.js
		 * │ │ └── preload.js
		 * │ ├── index.html
		 * │ ├── ...other-static-files-from-public
		 * │
		 * ```
		 */
		DIST: string
		/** /dist/ or /public/ */
		VITE_PUBLIC: string
	}
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
	// eslint-disable-next-line ts/consistent-type-imports
	ipcRenderer: import('electron').IpcRenderer
}
