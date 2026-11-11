import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		// Chagent generates the changelog.
		ignores: ['**/changelog.md'],
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
		type: 'lib',
	},
	{
		// Keep automatic syntax fixes within the browser build target.
		languageOptions: { ecmaVersion: 2022 },
		rules: {
			// These fixes use ES2023's toReversed, toSorted, and toSpliced.
			'e18e/prefer-array-to-reversed': 'off',
			'e18e/prefer-array-to-sorted': 'off',
			'e18e/prefer-array-to-spliced': 'off',
			// Tweakpane uses ClassName() factory
			'new-cap': ['error', { capIsNewExceptions: ['ClassName'] }],
			// The default fix adds ES2024's v flag.
			'require-unicode-regexp': ['error', { requireFlag: 'u' }],
			// Tweakpane uses null sentinels
			'ts/no-restricted-types': 'off',
			// Tweakpane binds methods in constructors
			'ts/unbound-method': 'off',
			// These fixes use ES2023's toReversed and toSorted.
			'unicorn/no-array-reverse': 'off',
			'unicorn/no-array-sort': 'off',
			// Tweakpane uses null sentinels
			'unicorn/no-null': 'off',
		},
	},
	{
		files: ['readme.md/*.{js,ts}'],
		rules: {
			// Pass lint before building
			'import/no-unresolved': 'off',
		},
	},
	// Template-dev-only-start (stripped at generation)
	{
		// Markdown code blocks contain the package-name placeholder before generation.
		files: ['**/*.md/*.{js,ts,jsx,tsx}'],
		rules: {
			'import/no-unresolved': ['error', { ignore: ['^[{]{3}github-repository[}]{3}$'] }],
		},
	},
	// Template-dev-only-end
)
