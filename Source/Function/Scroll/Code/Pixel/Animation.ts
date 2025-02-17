import type { Mouse } from "@Function/Scroll/Type.js";

export const Noise = (await import("simplex-noise")).createNoise2D();

export const Lerp = (a: number, b: number, t: number): number =>
	a + (b - a) * t;

export const Layer = (
	Time: number,
	Offset: number,
	Strength = 0.0001,
): number => Noise(Time + Offset, 20) + Strength * Noise(Time * 2 + Offset, 30);

export const Spectrum = (Step: number): string[] =>
	Array.from(
		{ length: Step },
		(_, i) => `hsl(${(i / Step) * 360}, 100%, 50%)`,
	);

export const Influence = (
	DX: number,
	DY: number,
	TimeCurrent: number,
	MouseState: Mouse,
): number => {
	const { RADIUS_EFFECT, FADE_DURATION } = Constant;

	return (
		Math.max(0, 1 - Math.sqrt(DX * DX + DY * DY) / RADIUS_EFFECT) *
		Math.max(0, 1 - (TimeCurrent - MouseState.Last) / FADE_DURATION)
	);
};

export const { default: Constant } = await import(
	"@Function/Scroll/Code/Pixel/Animation/Constant.ts"
);
