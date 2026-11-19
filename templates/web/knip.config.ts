import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignoreDependencies: [
		'modern-web-guidance', // Provides an agent skill through pnpm's skill linking.
	],
})
