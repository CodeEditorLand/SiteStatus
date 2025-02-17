import type { Mouse, MovementDimensional } from "@Function/Scroll/Type.js";

export default class {
	private readonly currentTime: number;

	private readonly seed: number;

	private readonly mouseState: Mouse;

	private readonly mouseInfluence: number;

	constructor(
		currentTime: number,

		seed: number,

		mouseState: Mouse,

		mouseInfluence: number,
	) {
		this.currentTime = currentTime;

		this.seed = seed;

		this.mouseState = mouseState;

		this.mouseInfluence = mouseInfluence;
	}

	calculate(dx: number, dy: number): MovementDimensional {
		const { DIMENSION } = Constant;

		const mouseFactor =
			this.mouseInfluence * Math.min(1, this.mouseState.Velocity / 100);

		return Array.from({ length: DIMENSION }).reduce(
			(acc, _, i) => {
				const noiseParams = {
					amplitude: 20 + i * 10,

					frequency: 0.002 + i * 0.001,

					phase: this.seed + i * 1000,
				};

				const value = Noise(
					this.currentTime * 0.001 * noiseParams.frequency +
						noiseParams.phase,

					i * 1000 + this.seed,
				);

				this.applyDimensionalEffect(
					acc as MovementDimensional,

					i,

					value,

					noiseParams.amplitude,

					dx,

					dy,

					mouseFactor,
				);

				return acc;
			},

			{ X: 0, Y: 0, Rotation: 0, Scale: 1 },
		) as MovementDimensional;
	}

	private applyDimensionalEffect(
		acc: MovementDimensional,

		dimension: number,

		value: number,

		amplitude: number,

		dx: number,

		dy: number,

		mouseFactor: number,
	): void {
		// biome-ignore lint/style/useDefaultSwitchClause:
		switch (dimension) {
			case 0:
				acc.X = value * amplitude + dx * mouseFactor;

				break;

			case 1:
				acc.Y = value * amplitude + dy * mouseFactor;

				break;

			case 2:
				acc.Rotation = value * 360 * mouseFactor;

				break;

			case 3:
				acc.Scale = 1 + value * 0.5 * mouseFactor;

				break;
		}
	}
}

export const { default: Constant } = await import(
	"@Function/Scroll/Code/Pixel/Animation/Constant.js"
);

export const { Noise } = await import(
	"@Function/Scroll/Code/Pixel/Animation.js"
);
