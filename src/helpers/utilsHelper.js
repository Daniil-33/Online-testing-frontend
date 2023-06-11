export function arrayToObjectByKey(key, data) {
	return Object.fromEntries(data.map((item) => [item[key], item]))
}

export function clearObjectAttrs(attrs, data) {
	return Object.fromEntries(
		Object.entries(data).filter(([attrName, value]) => !attrs.includes(attrName))
	)
}

export function promiseWrap(func, funcArgs = []) {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await func(...funcArgs)
			resolve(result)
		} catch (error) {
			reject(error)
		}
	})
}

export function removeEmptyObjectAttrs(data) {
	return Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null))
}

export function set(object, key, value) {
	return (object[key] = value)
}

export function range(int) {
	return [...Array(int).keys()]
}

export function safeAsyncCall(promise) {
	return promise
		.then((data) => [null, data])
		.catch((error) => [error, null])
}

export function copyToClipboard(string) {
	navigator.clipboard.writeText(string);
}
