import type { RGB } from "@Function/Table/Layout/Code/HEX.js";

export default (...[HEX]: [string]): RGB => {
	// biome-ignore lint/performance/useTopLevelRegex:
	HEX = HEX.replace(/^#/, "");

	if (HEX.length === 3) {
		HEX = HEX.split("")
			.map((_String) => _String + _String)
			.join("");
	}

	const Big = Number.parseInt(HEX, 16);

	return [(Big >> 16) & 255, (Big >> 8) & 255, Big & 255];
};
