import type { RGB } from "@Function/Commit/Layout/Code/HEX.js";

export default (...[Previous, Next, By]: [RGB, RGB, number]): RGB => [
	Math.round(Previous[0] + By * (Next[0] - Previous[0])),
	Math.round(Previous[1] + By * (Next[1] - Previous[1])),
	Math.round(Previous[2] + By * (Next[2] - Previous[2])),
];
