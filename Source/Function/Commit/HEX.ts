export type RGB = [number, number, number];

export default (...[RGB]: RGB) =>
	"#" +
	[RGB]
		.map((String) => {
			const HEX = String.toString(16);

			return HEX.length === 1 ? "0" + HEX : HEX;
		})
		.join("");
