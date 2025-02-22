export const _Function = (_Array: any[]): any[] | {} => {
	if (Array.isArray(_Array)) {
		return _Array.map(_Function);
	}

	if (_Array && typeof _Array === "object") {
		const Key = Object.keys(_Array);

		if (
			Key.length === 2 &&
			Key.includes("status") &&
			Key.includes("value")
		) {
			// @ts-expect-error
			return _Function(_Array.value);
		}

		const Return = {};

		// @ts-expect-error
		for (let Key in _Array) {
			// @ts-expect-error
			Return[Key] = _Function(_Array[Key]);
		}

		return Return;
	}

	return _Array;
};

export default _Function;
