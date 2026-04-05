// Console.log('Loaded main!')

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------

// Support for static imports
import imageStatic from '~aphex/Projects/LP/ABB - Client Centers/Product/ar-render-detail'
import imageStatic2 from '~aphex/Tiny/tiny'
// import imageStatic3 from '~aphex/Tiny/tiny'

console.log('Static import:', imageStatic)

const imageStaticElement = document.createElement('img')
imageStaticElement.src = typeof imageStatic === 'string' ? imageStatic : ''
imageStaticElement.width = 100
document.body.append(imageStaticElement)

console.log('Static import:', imageStatic2)

const imageStatic2Element = document.createElement('img')
imageStatic2Element.src = typeof imageStatic2 === 'string' ? imageStatic2 : ''
imageStatic2Element.width = 100
document.body.append(imageStatic2Element)

// Console.log('Static import:', imageStatic3)
// const imageStatic3Element = document.createElement('img')
// imageStatic3Element.src = typeof imageStatic3 === 'string' ? imageStatic3 : ''
// imageStatic3Element.width = 100
// document.body.append(imageStatic3Element)

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------

// Support for dynamic imports with hardcoded path
// const temp = '~aphex/Tiny/tiny'
// // eslint-disable-next-line ts/no-unsafe-assignment
// const imageDynamic = await import(/* @vite-ignore */ temp)
// console.log(imageDynamic)
// // eslint-disable-next-line ts/no-unsafe-member-access
// console.log('Dynamic import:', imageDynamic.default)

// const imageDynamicElement = document.createElement('img')

// // eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-member-access
// imageDynamicElement.src = imageDynamic.default
// imageDynamicElement.width = 100
// document.body.append(imageDynamicElement)

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------

// Support for dynamic imports with variable path using virtual loader module
// import { loadAphex } from 'virtual:aphex-loader'

// Try {
// const photoPath = '~aphex/Tiny/tiny'

// const imageVirtual = await loadAphex(photoPath)

// 	// const imageReimported = await import(imageVirtual)

// console.log(`Load Aphex Dynamic import:`, imageVirtual)
// 	// Console.log(imageReimported)

// const imageVirtualElement = document.createElement('img')
// imageVirtualElement.src = imageVirtual
// imageVirtualElement.width = 100
// document.body.append(imageVirtualElement)
// } catch (error: unknown) {
// 	console.error('Virtual loader resolveAphexPath failed:', error)
// }

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------
