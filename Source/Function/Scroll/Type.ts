import type { Accessor } from "solid-js";

export interface Mouse {
	X: number;

	Y: number;

	XPrevious: number;

	YPrevious: number;

	Velocity: number;

	Last: number;

	Active: boolean;
}

export interface MovementDimensional {
	X: number;

	Y: number;

	Rotation: number;

	Scale: number;
}

export interface PixelProps {
	Font: number;

	Character: number;

	Index: number;

	Show: number;

	Text: number;

	Mouse: Accessor<Mouse>;

	Container: DOMRect;

	CurrentTime: Accessor<number>;

	Row: number;

	Column: number;
}
