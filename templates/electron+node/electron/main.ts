import { app, BrowserWindow } from 'electron'
import { log } from 'lognow'
import path from 'node:path'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}

// Logging early also sets up receipt of renderer logs over IPC
log.info('Hello from Main!')

let win: BrowserWindow | undefined

async function createWindow() {
	win = new BrowserWindow({
		webPreferences: {
			preload: path.join(import.meta.dirname, '../preload/preload.cjs'),
		},
	})

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	// Set by electron-vite when the renderer dev server is running
	const devServerUrl = process.env.ELECTRON_RENDERER_URL
	if (devServerUrl === undefined || devServerUrl === '') {
		await win.loadFile(path.join(import.meta.dirname, '../renderer/index.html'))
	} else {
		await win.loadURL(devServerUrl)
		win.webContents.openDevTools()
	}
}

app.on('window-all-closed', () => {
	app.quit()
	win = undefined
})

app.on('ready', () => {
	void createWindow()
})
