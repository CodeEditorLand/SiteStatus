import type { RGB } from "@Function/Commit/Layout/Code/HEX.js";

export default (...[HEX]: [string]): RGB => {
	HEX = HEX.replace(/^#/, "");

	if (HEX.length === 3) {
		HEX = HEX.split("")
			.map((String) => String + String)
			.join("");
	}

	const Big = parseInt(HEX, 16);

	return [(Big >> 16) & 255, (Big >> 8) & 255, Big & 255];
};
