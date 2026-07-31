/* eslint-disable ts/consistent-type-definitions */

// Used in Renderer process, expose in `preload.ts`
interface Window {
	// eslint-disable-next-line ts/consistent-type-imports
	ipcRenderer: import('electron').IpcRenderer
}
