import type { TypedFlatConfigItem } from '@kitschpatrol/eslint-config'
import { eslintConfig } from '@kitschpatrol/eslint-config'
import { TEMPLATE_TYPES } from './src/template'

export default eslintConfig(
	{
		// Enable as needed:
		// astro: true,
		// react: true,
		// svelte: true,
		// No other way around "Unused eslint-disable directive"
		ignores: ['templates/electron/electron/electron-env.d.ts'],
		type: 'lib',
	},
	...templateOverrides(),
)

// Only way to quiet programmatic lint output, but still doesn't apply to the
// vscode plugin
function templateOverrides(): TypedFlatConfigItem[] {
	return TEMPLATE_TYPES.map((type) => ({
		basePath: `templates/${type}`,
		rules: {
			'import/no-unresolved': 'off',
			'json-package/valid-author': 'off',
			'json-package/valid-name': 'off',
			'mdx/remark': 'off',
			'ts/consistent-type-definitions': 'off',
			'unicorn/no-abusive-eslint-disable': 'off',
			'unicorn/no-null': 'off',
			'unicorn/no-process-exit': 'off',
		},
	}))
}
