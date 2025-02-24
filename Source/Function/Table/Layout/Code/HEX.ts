export type RGB = [number, number, number];

export default (...[RGB]: [RGB]): string =>
	`#${RGB.map((_String) => {
		const HEX = _String.toString(16);

		return HEX.length === 1 ? `0${HEX}` : HEX;
	}).join("")}`;
