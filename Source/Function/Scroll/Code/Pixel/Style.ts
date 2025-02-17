import type { Mouse, MovementDimensional } from "@Function/Scroll/Type.js";

export default class {
	private readonly element: HTMLDivElement | undefined;

	private readonly timeN: number;

	private readonly seed: number;

	private readonly column: number;

	private readonly position: number;

	private readonly mouseInfluence: number;

	private readonly offsets: MovementDimensional;

	private readonly mouseState: Mouse;

	private readonly colorSpectrum: string[];

	constructor(
		element: HTMLDivElement | undefined,
		params: {
			timeN: number;

			Seed: number;

			Column: number;

			Position: number;

			mouseInfluence: number;

			offsets: MovementDimensional;

			mouseState: Mouse;

			colorSpectrum: string[];
		},
	) {
		this.element = element;

		this.timeN = params.timeN;

		this.seed = params.Seed;

		this.column = params.Column;

		this.position = params.Position;

		this.mouseInfluence = params.mouseInfluence;

		this.offsets = params.offsets;

		this.mouseState = params.mouseState;

		this.colorSpectrum = params.colorSpectrum;
	}

	updateStyles(): void {
		this.updateTransform();

		this.updateZIndex();

		this.updateColors();

		this.updateShadow();

		this.updateOpacity();

		this.updateTransition();
	}

	private updateTransform(): void {
		const baseTransform = `rotate(${
			(Layer(this.timeN + this.seed, this.column + this.position) *
				Math.PI +
				this.offsets.Rotation * this.mouseInfluence) *
			(180 / Math.PI)
		}deg) translateX(${this.calculateRadius()}px)`;

		if (this.element) {
			this.element.style.transform = this.mouseState.Active
				? `${baseTransform} translate(${this.offsets.X}px, ${this.offsets.Y}px) scale(${this.offsets.Scale})`
				: baseTransform;
		}
	}

	private calculateRadius(): number {
		return (
			((Layer(this.timeN + this.seed, this.column + this.position) + 1) /
				2) *
				(Constant.AMPLITUDE_BASE +
					Layer(this.timeN, 10) * Constant.AMPLITUDE_VARIATION) *
				(1 - this.mouseInfluence) +
			Math.sqrt(
				this.offsets.X * this.offsets.X +
					this.offsets.Y * this.offsets.Y,
			) *
				this.mouseInfluence
		);
	}

	private updateZIndex(): void {
		if (this.element) {
			this.element.style.zIndex = Math.floor(
				Lerp(
					Math.floor(
						((Layer(
							this.timeN + this.seed,
							this.column + this.position,
						) +
							1) /
							2) *
							10,
					),
					100,
					this.mouseInfluence,
				),
			).toString();
		}
	}

	private updateColors(): void {
		// @ts-expect-error
		this.element.style.backgroundColor = this.mouseState.Active
			? `hsl(${Lerp(
					((Layer(
						this.timeN + this.seed,
						this.column + this.position,
					) +
						1) /
						2) *
						360,
					(this.mouseState.Velocity * 2) % 360,
					this.mouseInfluence,
				)}, 100%, 50%)`
			: this.colorSpectrum[
					Math.floor(
						(Layer(
							this.timeN + this.seed,
							this.column + this.position,
						) +
							1) *
							180,
					)
				];
	}

	private updateShadow(): void {
		if (this.element) {
			this.element.style.boxShadow = `0 0 ${Lerp(
				((Layer(this.timeN + this.seed, this.column + 50) + 1) / 2) *
					10,
				this.mouseInfluence * 20,
				this.mouseInfluence,
			)}px ${
				this.mouseState.Active
					? this.element.style.backgroundColor
					: this.colorSpectrum[
							Math.floor(
								(Layer(
									this.timeN + this.seed,
									this.column + this.position,
								) +
									1) *
									180,
							)
						]
			}`;
		}
	}

	private updateOpacity(): void {
		if (this.element) {
			this.element.style.opacity = Lerp(
				((Layer(this.timeN + this.seed, this.column + 150) + 1) / 2) *
					0.3 +
					0.7,
				1,
				this.mouseInfluence,
			).toString();
		}
	}

	private updateTransition(): void {
		if (this.element) {
			this.element.style.transitionDuration = `${(
				((Layer(this.timeN + this.seed, this.column + 100) + 1) / 2) *
					10 +
				5
			).toFixed(2)}s`;
		}
	}
}

export const { default: Constant } = await import(
	"@Function/Scroll/Code/Pixel/Animation/Constant.js"
);

export const { Layer, Lerp } = await import(
	"@Function/Scroll/Code/Pixel/Animation.js"
);
