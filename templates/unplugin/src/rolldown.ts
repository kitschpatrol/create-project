/**
 * This entry file is for Rolldown plugin.
 * @module
 */

import { starter } from './index'

/**
 * Rolldown plugin
 * @example
 * ```ts
 * // rolldown.config.js
 * import starter from '{{{github-repository}}}/rolldown'
 *
 * export default {
 *   plugins: [starter()],
 * }
 * ```
 */
const { rolldown } = starter
export default rolldown
export { rolldown as 'module.exports' }
