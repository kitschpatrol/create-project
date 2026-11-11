import { Pane } from 'tweakpane'
import { afterEach, describe, expect, it } from 'vitest'
import * as plugin from '../src/index'
import { textInputPlugin } from '../src/plugin'

describe('text input plugin', () => {
	let pane: Pane | undefined

	afterEach(() => {
		pane?.dispose()
	})

	function setup() {
		pane = new Pane()
		pane.registerPlugin(plugin)
		const params = { message: 'Hello' }
		const binding = pane.addBinding(params, 'message', {
			placeholder: 'Enter a message',
			view: 'text-input',
		})
		const input = binding.element.querySelector('input')
		if (!input) {
			throw new Error('The custom input was not created')
		}

		return { binding, input, pane, params }
	}

	it('accepts only strings with the requested view and valid options', () => {
		expect(textInputPlugin.accept('Hello', { view: 'text-input' })?.initialValue).toBe('Hello')
		expect(textInputPlugin.accept(123, { view: 'text-input' })).toBeNull()
		expect(textInputPlugin.accept('Hello', {})).toBeNull()
		expect(textInputPlugin.accept('Hello', { view: 'another-input' })).toBeNull()
		expect(textInputPlugin.accept('Hello', { placeholder: 123, view: 'text-input' })).toBeNull()
	})

	it('registers the bundle and installs its compiled styles', () => {
		const { input } = setup()
		expect(input.value).toBe('Hello')
		expect(input.placeholder).toBe('Enter a message')
		expect(plugin.css).toContain('.tp-textinputv')
		expect(plugin.css).not.toContain('@use')
		expect(document.head.textContent).toContain('.tp-textinputv')
	})

	it('writes input changes and emits a final event when committed', () => {
		const { binding, input, params } = setup()
		const changes: Array<{ last: boolean; value: string }> = []
		binding.on('change', (event) => {
			changes.push({ last: event.last, value: event.value })
		})
		input.value = 'Updated'
		input.dispatchEvent(new Event('input', { bubbles: true }))
		input.dispatchEvent(new Event('change', { bubbles: true }))
		expect(params.message).toBe('Updated')
		expect(changes).toEqual([
			{ last: false, value: 'Updated' },
			{ last: true, value: 'Updated' },
		])
	})

	it('refreshes when the bound value changes externally', () => {
		const { binding, input, params } = setup()
		params.message = 'External update'
		binding.refresh()
		expect(input.value).toBe('External update')
	})

	it('inherits the pane disabled state and supports hiding the binding', () => {
		const { binding, input, pane: currentPane, params } = setup()
		currentPane.disabled = true
		expect(input.disabled).toBe(true)
		input.value = 'Ignored'
		input.dispatchEvent(new Event('input', { bubbles: true }))
		expect(params.message).toBe('Hello')
		currentPane.disabled = false
		expect(input.disabled).toBe(false)
		binding.hidden = true
		expect(binding.element.classList.contains('tp-v-hidden')).toBe(true)
	})

	it('removes input listeners when the binding is disposed', () => {
		const { binding, input, params } = setup()
		binding.dispose()
		input.value = 'Ignored'
		input.dispatchEvent(new Event('input', { bubbles: true }))
		input.dispatchEvent(new Event('change', { bubbles: true }))
		expect(params.message).toBe('Hello')
		expect(input.isConnected).toBe(false)
	})
})
