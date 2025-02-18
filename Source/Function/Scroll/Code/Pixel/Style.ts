import type { Mouse, MovementDimensional } from "@Function/Scroll/Type.js";
import { createEffect, type Accessor } from "solid-js";

export default class {
	private readonly Element: HTMLDivElement;

	private readonly TimeNoise: number;

	private readonly Seed: number;

	private readonly Column: number;

	private readonly Position: number;

	private readonly Influence: number;

	private readonly Offset: MovementDimensional;

	private readonly Mouse: Accessor<Mouse>;

	private readonly Spectrum: string[];

	private readonly Dust: HTMLDivElement[] = [];

	private ParticleSeed: number[] = [];

	private StateParticle: Array<{
		Start: number;

		Duration: number;

		ID?: number;
	}> = [];

	constructor(
		Element: HTMLDivElement,

		Parameter: {
			TimeNoise: number;

			Seed: number;

			Column: number;

			Position: number;

			Influence: number;

			Offset: MovementDimensional;

			Mouse: Accessor<Mouse>;

			Spectrum: string[];
		},
	) {
		this.Element = Element;

		this.TimeNoise = Parameter.TimeNoise;

		this.Seed = Parameter.Seed;

		this.Column = Parameter.Column;

		this.Position = Parameter.Position;

		this.Influence = Parameter.Influence;

		this.Offset = Parameter.Offset;

		this.Mouse = Parameter.Mouse;

		this.Spectrum = Parameter.Spectrum;
	}

	Roll(): void {
		this.Transform();

		this.ZIndex();

		this.Color();

		this.Particle();

		this.Shadow();

		this.Opacity();

		this.Transition();
	}

	private Transform(): void {
		const Transform = `rotate(${
			(Layer(this.TimeNoise + this.Seed, this.Column + this.Position) *
				Math.PI +
				this.Offset.Rotation * this.Influence) *
			(180 / Math.PI)
		}deg) translateX(${this.Radius()}px)`;

		createEffect(() => {
			this.Element.style.transform = this.Mouse().Active
				? `${Transform} translate(${this.Offset.X}px, ${this.Offset.Y}px) scale(${this.Offset.Scale})`
				: Transform;
		});
	}

	private Radius(): number {
		return (
			((Layer(this.TimeNoise + this.Seed, this.Column + this.Position) +
				1) /
				2) *
				(Constant.AMPLITUDE_BASE +
					Layer(this.TimeNoise, 10) * Constant.AMPLITUDE_VARIATION) *
				(1 - this.Influence) +
			Math.sqrt(
				this.Offset.X * this.Offset.X + this.Offset.Y * this.Offset.Y,
			) *
				this.Influence
		);
	}

	private ZIndex(): void {
		this.Element.style.zIndex = Math.floor(
			Lerp(
				Math.floor(
					((Layer(
						this.TimeNoise + this.Seed,

						this.Column + this.Position,
					) +
						1) /
						2) *
						10,
				),

				100,

				this.Influence,
			),
		).toString();
	}

	private Color(): void {
		createEffect(() => {
			// @ts-expect-error
			this.Element.style.backgroundColor = this.Mouse().Active
				? `hsl(${Lerp(
						((Layer(
							this.TimeNoise + this.Seed,

							this.Column + this.Position,
						) +
							1) /
							2) *
							360,

						(this.Mouse().Velocity * 2) % 360,

						this.Influence,
					)}, 100%, 50%)`
				: this.Spectrum[
						Math.floor(
							(Layer(
								this.TimeNoise + this.Seed,

								this.Column + this.Position,
							) +
								1) *
								180,
						)
					];
		});
	}

	private Shadow(): void {
		createEffect(() => {
			const Color = this.Mouse().Active
				? this.Element.style.backgroundColor
				: this.Spectrum[
						Math.floor(
							(Layer(
								this.TimeNoise + this.Seed,

								this.Column + this.Position,
							) +
								1) *
								180,
						)
					];

			this.Element.style.boxShadow = `0 0 ${Lerp(
				((Layer(this.TimeNoise + this.Seed, this.Column + 50) + 1) /
					2) *
					10,

				this.Influence * 20,

				this.Influence,
			)}px ${Color}`;

			this.Dust.forEach(
				(
					Particle,
					Index, // @ts-expect-error
				) => this.ParticleUpdate(Particle, Index, Color),
			);
		});
	}

	private Opacity(): void {
		this.Element.style.opacity = Lerp(
			((Layer(this.TimeNoise + this.Seed, this.Column + 150) + 1) / 2) *
				0.3 +
				0.7,

			1,

			this.Influence,
		).toString();
	}

	private Transition(): void {
		this.Element.style.transitionDuration = `${(
			((Layer(this.TimeNoise + this.Seed, this.Column + 100) + 1) / 2) *
				10 +
			5
		).toFixed(2)}s`;
	}

	private ParticleUpdate(
		Particle: HTMLDivElement,
		Index: number,
		Color: string,
	): void {
		const State = this.StateParticle[Index];

		const Seed = this.ParticleSeed[Index] ?? 0;

		const Jiggle = (CurrentTime: number) => {
			// @ts-expect-error
			const Elapsed = CurrentTime - State.Start;

			// @ts-expect-error
			const Progress = Math.min(Elapsed / State.Duration, 1);

			const TimeNoise = this.TimeNoise + Progress * Seed;

			// Calculate base properties using noise
			const Scale = Lerp(
				0.8,
				0.2,
				(Layer(TimeNoise, this.Column + 300) + 1) / 2,
			);

			const Opacity = Lerp(
				0.8,
				0,
				(Layer(TimeNoise, this.Column + 400) + 1) / 2,
			);

			// 3D rotations using noise
			const XRotate = Lerp(
				0,
				360,
				(Layer(TimeNoise, this.Column + 500) + 1) / 2,
			);

			const YRotate = Lerp(
				0,
				360,
				(Layer(TimeNoise, this.Column + 600) + 1) / 2,
			);

			const ZRotate = Lerp(
				0,
				360,
				(Layer(TimeNoise, this.Column + 700) + 1) / 2,
			);

			let Transform: string;

			if (this.Mouse().Active && this.Influence > 0) {
				// Calculate spiral motion when mouse is active
				const ProgressSpiral =
					(Progress + Index / Constant.DUST_PARTICLE_COUNT) % 1;

				// Spiral parameters affected by mouse velocity and influence
				const HeightSpiral =
					Constant.SPIRAL_HEIGHT *
					this.Influence *
					(1 - ProgressSpiral);

				const RadiusSpiral = Constant.SPIRAL_RADIUS * this.Influence;

				const Angle =
					ProgressSpiral * Math.PI * 2 * Constant.SPIRAL_ROTATIONS;

				const XSpiral = Math.cos(Angle) * RadiusSpiral * ProgressSpiral;

				const ZSpiral = Math.sin(Angle) * RadiusSpiral * ProgressSpiral;

				const XOffsetVelocity =
					this.Mouse().Velocity * 20 * this.Influence;

				const YOffsetVelocity =
					-this.Mouse().Velocity * 15 * this.Influence;

				Transform = `
                    translate3d(
                        calc(-50% + ${XSpiral + XOffsetVelocity}px),
                        ${-HeightSpiral + YOffsetVelocity}px,
                        ${ZSpiral}px
                    )
                    rotateX(${XRotate + this.Mouse().Velocity * 720 * this.Influence}deg)
                    rotateY(${YRotate + this.Mouse().Velocity * 720 * this.Influence}deg)
                    rotateZ(${ZRotate + Angle * (180 / Math.PI)}deg)
                    scale3d(${Scale}, ${Scale}, ${Scale})
                `;
			} else {
				Transform = `
                    translate3d(
                        calc(-50% + ${Lerp(
							-20,
							20,
							(Layer(TimeNoise, this.Column + 100) + 1) / 2,
						)}px),
                        ${Lerp(
							0,
							50,
							(Layer(TimeNoise, this.Column + 200) + 1) / 2,
						)}px,
                        0
                    )
                    rotateX(${XRotate}deg)
                    rotateY(${YRotate}deg)
                    rotateZ(${ZRotate}deg)
                    scale3d(${Scale}, ${Scale}, ${Scale})
                `;
			}

			Object.assign(Particle.style, {
				backgroundColor: Color,
				opacity: Opacity.toString(),
				transform: Transform,
			});

			if (Progress >= 1) {
				// @ts-expect-error
				State.Start = CurrentTime;

				this.ParticleSeed[Index] = Math.random() * 1000;
			}

			// @ts-expect-error
			State.ID = requestAnimationFrame(Jiggle);
		};

		// @ts-expect-error
		if (State.ID) {
			// @ts-expect-error
			cancelAnimationFrame(State.ID);
		}

		// @ts-expect-error
		State.ID = requestAnimationFrame(Jiggle);
	}

	private Particle(): void {
		this.Dust.forEach((Particle, index) => {
			if (this.StateParticle[index]?.ID) {
				cancelAnimationFrame(this.StateParticle[index].ID!);
			}

			Particle.remove();
		});

		this.Dust.length = 0;

		this.StateParticle.length = 0;

		this.ParticleSeed = Array.from(
			{ length: Constant.DUST_PARTICLE_COUNT },
			() => Math.random() * 1000,
		);

		for (let i = 0; i < Constant.DUST_PARTICLE_COUNT; i++) {
			const Particle = document.createElement("div");

			Particle.className = "Dust";

			Object.assign(Particle.style, {
				position: "absolute",
				pointerEvents: "none",
				width: "2px",
				height: "2px",
				borderRadius: "50%",
				left: "50%",
				top: "100%",
				willChange: "transform, opacity",
			});

			this.Element.appendChild(Particle);

			this.Dust.push(Particle);

			this.StateParticle.push({
				Start: performance.now(),
				Duration: 5000000 + Math.random() * 1000,
			});
		}
	}
}

export const { default: Constant } = await import(
	"@Function/Scroll/Code/Pixel/Animation/Constant.js"
);

export const { Layer, Lerp } = await import(
	"@Function/Scroll/Code/Pixel/Animation.js"
);
