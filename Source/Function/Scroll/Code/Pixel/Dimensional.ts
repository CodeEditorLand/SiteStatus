import type { Mouse, MovementDimensional } from "@Function/Scroll/Type.js";

export default class {
	private readonly TimeCurrent: number;

	private readonly Seed: number;

	private readonly StateMouse: Mouse;

	private readonly InfluenceMouse: number;

	constructor(
		TimeCurrent: number,
		Seed: number,
		StateMouse: Mouse,
		InfluenceMouse: number,
	) {
		this.TimeCurrent = TimeCurrent;

		this.Seed = Seed;

		this.StateMouse = StateMouse;

		this.InfluenceMouse = InfluenceMouse;
	}

	Calculate(dx: number, dy: number): MovementDimensional {
		const {
			DIMENSION,
			AMPLITUDE_BASE,
			AMPLITUDE_VARIATION,
			MULTIPLIER_TIME_BASE,
			MULTIPLIER_TIME_VARIATION,
			COLOR_STEPS,
		} = Constant;

		const FactorMouse =
			this.InfluenceMouse * Math.min(1, this.StateMouse.Velocity / 100);

		return Array.from({ length: DIMENSION }).reduce(
			(Accumulate, _, Index): void => {
				this.Apply(
					Accumulate as MovementDimensional,
					Index,
					Layer(
						this.TimeCurrent *
							(MULTIPLIER_TIME_BASE +
								Index * MULTIPLIER_TIME_VARIATION) +
							this.Seed,
						Index * 1000,
					),
					AMPLITUDE_BASE + Index * AMPLITUDE_VARIATION,
					dx,
					dy,
					FactorMouse,
					COLOR_STEPS,
				);

				return Accumulate;
			},
			{ X: 0, Y: 0, Rotation: 0, Scale: 1 } as MovementDimensional,
		) as MovementDimensional;
	}

	private Apply(
		Accumulate: MovementDimensional,
		Dimension: number,
		Value: number,
		amplitude: number,
		DX: number,
		DY: number,
		FactorMouse: number,
		colorSteps: number,
	): void {
		switch (Dimension) {
			case 0:
				Accumulate.X = Value * amplitude + DX * FactorMouse;

				break;

			case 1:
				Accumulate.Y = Value * amplitude + DY * FactorMouse;

				break;

			case 2:
				Accumulate.Rotation = Value * colorSteps * FactorMouse;

				break;

			case 3:
				Accumulate.Scale = 1 + Value * 0.5 * FactorMouse;

				break;
		}
	}
}

// Import the same Constant and noise function as your pixel style calculator.
export const { default: Constant } = await import(
	"@Function/Scroll/Code/Pixel/Animation/Constant.js"
);

export const { Layer } = await import(
	"@Function/Scroll/Code/Pixel/Animation.js"
);
