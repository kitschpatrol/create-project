import { eslintConfig } from '@kitschpatrol/eslint-config'

// ESLint 10 resolves the config file nearest to each linted file, so template
// projects are linted with their own eslint.config.ts files, which carry
// `Template-dev-only` overrides (stripped at generation) to silence
// placeholder-value errors.
export default eslintConfig({
	type: 'lib',
})
