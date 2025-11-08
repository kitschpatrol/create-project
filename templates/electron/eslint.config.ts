import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig({
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
	type: 'lib',
})
