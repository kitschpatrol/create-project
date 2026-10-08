import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		ignores: ['/test/fixtures/**'],
		// Template-dev-only-start (stripped at generation)
		json: {
			overrides: {
				'json-package/valid-author': 'off',
				'json-package/valid-name': 'off',
				'json-package/valid-repository': 'off',
			},
		},
		md: {
			overrides: {
				'mdx/remark': 'off',
			},
		},
		// Template-dev-only-end
		ts: {
			overrides: {
				'jsdoc/require-description': 'off',
			},
		},
		type: 'lib',
	},
	{
		files: ['playground/package.json'],
		rules: {
			'json-package/require-author': 'off',
			'json-package/require-keywords': 'off',
			'json-package/require-version': 'off',
		},
	},
)
