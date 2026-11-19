import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignoreDependencies: [
		'stylelint-config-standard-scss', // Loaded through the shared Stylelint configuration factory.
	],
})
