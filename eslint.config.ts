import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		// Enable as needed:
		// astro: true,
		// react: true,
		// svelte: true,
		type: 'lib',
	},
	{
		basePath: 'templates/cli',
		files: ['package.json'],
		rules: {
			'json-package/valid-author': 'off',
			'json-package/valid-name': 'off',
		},
	},
)
