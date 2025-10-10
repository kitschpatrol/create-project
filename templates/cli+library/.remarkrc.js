import { remarkConfig } from '@kitschpatrol/remark-config'

export default remarkConfig({
	// Useful if the repository is not yet pushed to a remote.
	rules: [['remarkValidateLinks', { repository: false }]],
})
