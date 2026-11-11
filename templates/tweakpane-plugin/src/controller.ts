import type { Value, ValueController, ViewProps } from '@tweakpane/core'
import { TextInputView } from './view'

type Config = {
	placeholder: string
	value: Value<string>
	viewProps: ViewProps
}

export class TextInputController implements ValueController<string, TextInputView> {
	readonly value: Value<string>
	readonly view: TextInputView
	readonly viewProps: ViewProps

	constructor(document: Document, config: Config) {
		this.value = config.value
		this.viewProps = config.viewProps
		this.view = new TextInputView(document, config)

		const onInput = () => {
			if (!this.view.inputElement.disabled) {
				this.value.setRawValue(this.view.inputElement.value, { forceEmit: false, last: false })
			}
		}

		const onChange = () => {
			if (!this.view.inputElement.disabled) {
				this.value.setRawValue(this.view.inputElement.value, { forceEmit: true, last: true })
			}
		}

		this.view.inputElement.addEventListener('input', onInput)
		this.view.inputElement.addEventListener('change', onChange)
		this.viewProps.handleDispose(() => {
			this.view.inputElement.removeEventListener('input', onInput)
			this.view.inputElement.removeEventListener('change', onChange)
		})
	}
}
