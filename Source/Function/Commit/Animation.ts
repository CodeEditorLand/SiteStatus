import { createNoise2D } from "simplex-noise";

export const Noise = createNoise2D();

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
