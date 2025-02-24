import type { Mouse } from "@Function/Scroll/Type.js";
import _Color from "@Function/TailWind/Color.js";

export const Noise = (await import("simplex-noise")).createNoise2D();

export const Flatten = (Color: any): string[] => {
	const Return: string[] = [];

	for (const [Key, Value] of Object.entries(Color)) {
		if (typeof Value === "string") {
			Return.push(Value);
		} else if (typeof Value === "object") {
			// @ts-expect-error
			Return.push(...Object.values(Value));
		}
	}

	return Return;
};

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

export const Spectrum = (Step: number): string[] => {
	// Extract and flatten the colors defined in Tailwind.
	const Color = Flatten(_Color);
	const Palette = Color.length;

	if (Step >= Palette) {
		return Color;
	}

	// @ts-expect-error
	return Array.from(
		{ length: Step },
		(_, Index): void => Color[Math.floor((Index * Palette) / Step)],
	);
};

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
	"@Function/Scroll/Code/Pixel/Animation/Constant.js"
);
