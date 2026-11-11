import type { BaseInputParams, InputBindingPlugin } from '@tweakpane/core'
import { createPlugin, parseRecord, stringFromUnknown, writePrimitive } from '@tweakpane/core'
import { TextInputController } from './controller'

/** Binding options that select the text input view for a string value. */
export type TextInputParams = BaseInputParams & {
	/** Text shown while the input is empty. */
	placeholder?: string
	/** Selects this plugin's view when passed to `pane.addBinding()`. */
	view: 'text-input'
}

export const textInputPlugin: InputBindingPlugin<string, string, TextInputParams> = createPlugin({
	accept(value, params) {
		if (typeof value !== 'string') {
			// Tweakpane uses null to pass unsupported bindings to the next plugin.
			return null
		}

		const parsed = parseRecord<TextInputParams>(params, (parser) => ({
			placeholder: parser.optional.string,
			view: parser.required.constant('text-input'),
		}))

		return parsed ? { initialValue: value, params: parsed } : null
	},
	binding: {
		reader() {
			return stringFromUnknown
		},
		writer() {
			return writePrimitive
		},
	},
	controller(args) {
		return new TextInputController(args.document, {
			placeholder: args.params.placeholder ?? '',
			value: args.value,
			viewProps: args.viewProps,
		})
	},
	id: 'text-input',
	type: 'input',
})
