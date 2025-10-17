import { app, BrowserWindow } from 'electron'
import path from 'node:path'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
process.env.DIST = path.join(import.meta.dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, '../public')

if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}

let win: BrowserWindow | undefined

async function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
		webPreferences: {
			preload: path.join(import.meta.dirname, './preload.mjs'),
		},
	})

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	if (process.env.VITE_DEV_SERVER_URL) {
		await win.loadURL(process.env.VITE_DEV_SERVER_URL)
		win.webContents.openDevTools()
	} else {
		//
		// win.loadFile('dist/index.html')
		await win.loadFile(path.join(process.env.DIST, 'index.html'))
	}
}

app.on('window-all-closed', () => {
	app.quit()
	win = undefined
})

app.on('ready', () => {
	void createWindow()
})
