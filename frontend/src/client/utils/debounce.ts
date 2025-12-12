export function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number | undefined,
) {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}
