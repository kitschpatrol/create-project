import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignoreDependencies: [
		'@kitschpatrol/chagent', // Invoked through bumpp's --execute argument.
		'modern-web-guidance', // Provides an agent skill through pnpm's skill linking.
	],
})
