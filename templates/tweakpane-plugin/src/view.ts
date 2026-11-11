import type { Value, View, ViewProps } from '@tweakpane/core'
import { ClassName as createClassName } from '@tweakpane/core'

type Config = {
	placeholder: string
	value: Value<string>
	viewProps: ViewProps
}

const className = createClassName('textinput')

export class TextInputView implements View {
	readonly element: HTMLElement
	readonly inputElement: HTMLInputElement

	constructor(document: Document, config: Config) {
		this.element = document.createElement('div')
		this.element.classList.add(className())
		config.viewProps.bindClassModifiers(this.element)

		this.inputElement = document.createElement('input')
		this.inputElement.type = 'text'
		this.inputElement.placeholder = config.placeholder
		this.inputElement.classList.add(className('i'))
		config.viewProps.bindDisabled(this.inputElement)
		this.element.append(this.inputElement)

		const refresh = () => {
			// Keep the caret position while the user edits the current value.
			if (this.inputElement.value !== config.value.rawValue) {
				this.inputElement.value = config.value.rawValue
			}
		}

		config.value.emitter.on('change', refresh)
		config.viewProps.handleDispose(() => {
			config.value.emitter.off('change', refresh)
		})
		refresh()
	}
}
