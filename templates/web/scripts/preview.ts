import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import open from 'open'

const url = new URL(process.argv[2] ?? 'http://127.0.0.1:8787/{{{github-repository}}}')
const cli = fileURLToPath(new URL('bin/wrangler.js', import.meta.resolve('wrangler/package.json')))
const worker = spawn(process.execPath, [cli, 'dev', '--local'], {
	stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
})
let stopped = false
let opened = false

// Wrangler forwards this readiness event through its CLI launcher's IPC channel.
worker.on('message', (message: unknown) => {
	if (stopped || opened || typeof message !== 'string') {
		return
	}

	let data: unknown
	try {
		data = JSON.parse(message)
	} catch {
		return
	}

	if (
		typeof data !== 'object' ||
		data === null ||
		!('event' in data) ||
		data.event !== 'DEV_SERVER_READY' ||
		!('ip' in data) ||
		typeof data.ip !== 'string' ||
		!('port' in data) ||
		typeof data.port !== 'number'
	) {
		return
	}

	opened = true
	url.hostname = data.ip
	url.port = String(data.port)
	void open(url.href).catch(() => {
		console.warn(`Could not open the preview automatically. Open ${url.href} in your browser.`)
	})
})
worker.once('error', (error) => {
	console.error(error.message)
	process.exitCode = 1
	stopped = true
})
worker.once('exit', (code, signal) => {
	process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1)
	stopped = true
})
function stop(signal: NodeJS.Signals) {
	stopped = true
	worker.kill(signal)
}

process.once('SIGINT', () => {
	stop('SIGINT')
})
process.once('SIGTERM', () => {
	stop('SIGTERM')
})

process.once('exit', () => {
	if (!stopped) {
		worker.kill()
	}
})
