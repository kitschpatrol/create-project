import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['test/fixtures/**'],
	ignoreDependencies: [
		'@kitschpatrol/chagent', // Invoked through bumpp's --execute argument.
	],
})
