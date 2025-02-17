import type { Mouse } from "@Function/Scroll/Type.js";

export const Noise = (await import("simplex-noise")).createNoise2D();

export const Lerp = (
	APoint: number,
	BPoint: number,
	TargetPoint: number,
): number => APoint + (BPoint - APoint) * TargetPoint;

export const Layer = (
	Time: number,
	Offset: number,
	Strength = 0.0001,
): number => Noise(Time + Offset, 20) + Strength * Noise(Time * 2 + Offset, 30);

export const Spectrum = (Step: number): string[] =>
	Array.from(
		{ length: Step },
		(_, Index) => `hsl(${(Index / Step) * 360}, 100%, 50%)`,
	);

export const Influence = (
	DX: number,
	DY: number,
	TimeCurrent: number,
	MouseState: Mouse,
): number => {
	return (
		Math.max(0, 1 - Math.sqrt(DX * DX + DY * DY) / Constant.RADIUS_EFFECT) *
		Math.max(
			0,
			1 - (TimeCurrent - MouseState.Last) / Constant.FADE_DURATION,
		)
	);
};

export const { default: Constant } = await import(
	"@Function/Scroll/Code/Pixel/Animation/Constant.ts"
);
