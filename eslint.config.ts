import type { TypedFlatConfigItem } from '@kitschpatrol/eslint-config'
import { eslintConfig } from '@kitschpatrol/eslint-config'
import { TEMPLATE_TYPES } from './src/template'

export default eslintConfig(
	{
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
		// Force linting template projects with the root tsconfig
		// languageOptions: {
		// 	parserOptions: {
		// 		project: './tsconfig.json',
		// 		projectService: false,
		// 	},
		// },
		// Packages are invalid because of template placeholders
		rules: {
			'import/no-unresolved': 'off',
			'json-package/require-author': 'off',
			'json-package/valid-author': 'off',
			'json-package/valid-name': 'off',
			'json-package/valid-repository': 'off',
			'mdx/remark': 'off',
			'unicorn/no-null': 'off',
			'unicorn/no-process-exit': 'off',
		},
	}))
}
