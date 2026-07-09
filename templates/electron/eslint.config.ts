import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig({
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
			'import/no-unresolved': [
				'error',
				{
					ignore: [
						'^astro:',
						'^@astrojs',
						'^virtual:',
						// Public Vite assets...
						'^/',
					],
				},
			],
			'unicorn/no-null': 'off',
			'unicorn/no-process-exit': 'off',
		},
	},
	type: 'app',
})
