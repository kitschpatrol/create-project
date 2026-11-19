import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignoreDependencies: [
		'@kitschpatrol/chagent', // Invoked through bumpp's --execute argument.
	],
})
