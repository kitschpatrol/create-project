import type { FilterPattern } from 'unplugin'

/**
 * @public
 */
export type Options = {
	enforce?: 'post' | 'pre' | undefined
	exclude?: FilterPattern
	include?: FilterPattern
}

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

/**
 * @public
 */
export type OptionsResolved = Overwrite<Required<Options>, Pick<Options, 'enforce'>>

const NODE_MODULES_REGEX = /node_modules/
const CODE_EXTENSIONS_REGEX = /\.[cm]?[jt]sx?$/
/**
 * Resolve and normalize user options.
 */
export function resolveOptions(options: Options): OptionsResolved {
	return {
		enforce: 'enforce' in options ? options.enforce : 'pre',
		exclude: options.exclude ?? [NODE_MODULES_REGEX],
		include: options.include ?? [CODE_EXTENSIONS_REGEX],
	}
}
