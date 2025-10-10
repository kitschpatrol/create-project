/**
 * Setup the counter on the button element
 * @param element - The button element to setup the counter on
 */
export function setupCounter(element: HTMLButtonElement) {
	let counter = 0
	const setCounter = (count: number) => {
		counter = count
		element.innerHTML = `count is ${counter}`
	}
	element.addEventListener('click', () => {
		setCounter(counter + 1)
	})
	setCounter(0)
}
