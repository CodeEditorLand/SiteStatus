import { createNoise2D } from "simplex-noise";
import {
	createSignal,
	onCleanup,
	onMount,
	type Accessor,
	type JSX,
} from "solid-js";

// Color spectrum generation
export const Spectrum = (Step: number): string[] => {
	const Spectrum: string[] = [];

	for (let Index = 0; Index < Step; Index++) {
		Spectrum.push(`hsl(${(Index / Step) * 360}, 100%, 50%)`);
	}
	return Spectrum;
};

export interface Mouse {
	X: number;

	Y: number;

	XPrevious: number;

	YPrevious: number;

	Velocity: number;

	Last: number;

	Active: boolean;
}

interface MovementDimensional {
	X: number;

	Y: number;

	Rotation: number;

	Scale: number;
}

// Color spectrum and constants remain the same
const All = Spectrum(360);

const RadiusEffect = 150;

const Dimension = 4;

const FadeDuration = 1000;

// biome-ignore lint/nursery/useComponentExportOnlyModules:
export default (
	...[Font, Character, Pixel, Show, Text, MouseState, Container]: [
		number,
		number,
		number,
		number,
		number,
		Accessor<Mouse>,
		Accessor<HTMLDivElement | undefined>,
	]
): JSX.Element => {
	const [Element, _Element] = createSignal<HTMLDivElement>();

	const Position = Character % Text;

	const Column = Pixel % 3;

	const Row = Math.floor(Pixel / 3);

	const Delay = Position * 0.1 + (Row * 3 + Column) * 0.05;

	if (Show) {
		const Seed = Position * 0.1 + Row * 0.05 + Column * 0.02;

		let Angle = 0;

		let Radius = 0;

		// Default animation parameters
		const AmplitudeB = 50;

		const AmplitudeV = 20;

		const SmoothingB = 0.05;

		const SmoothingV = 0.02;

		const MultiplierTimeB = 0.003;

		const MultiplierTimeV = 0.002;

		const TimeS = performance.now();

		onMount(() => {
			let ID: number;

			const Move = (): void => {
				if (!(Element() && Container)) {
					ID = requestAnimationFrame(Move);

					return;
				}

				const CurrentTime = performance.now();

				const MouseTime = CurrentTime - MouseState().Last;

				const MouseTransition = Math.max(
					0,
					1 - MouseTime / FadeDuration,
				);

				// Calculate default simplex noise animation parameters
				const NoiseTimeB = CurrentTime * 0.001 + Seed;

				const SmoothingD =
					SmoothingB + Noise(NoiseTimeB, 20) * SmoothingV;

				const TimeN =
					Position * 0.1 +
					CurrentTime *
						(MultiplierTimeB +
							Noise(NoiseTimeB, 30) * MultiplierTimeV);

				// Mouse influence calculations (if active)
				let InfluenceMouse = 0;

				let OffsetDimensional: MovementDimensional = {
					X: 0,
					Y: 0,
					Rotation: 0,
					Scale: 1,
				};

				if (MouseState().Active) {
					const dx =
						MouseState().X -
						// @ts-expect-error
						(Container().getBoundingClientRect().left +
							Column * Font);

					const dy =
						MouseState().Y -
						// @ts-expect-error
						(Container().getBoundingClientRect().top + Row * Font);

					InfluenceMouse = Lerp(
						InfluenceMouse,
						Math.max(
							0,
							1 - Math.sqrt(dx * dx + dy * dy) / RadiusEffect,
						) * MouseTransition,
						0.1,
					);

					// Calculate dimensional offsets with mouse influence
					OffsetDimensional = new Array(Dimension)
						.fill(0)
						.map((_, i) => ({
							Amplitude: 20 + i * 10,
							Frequence: 0.002 + i * 0.001,
							Phase: Seed + i * 1000,
						}))
						.reduce((MovementDimensional, _Noise, Dimension) => {
							const Value = Noise(
								CurrentTime * 0.001 * _Noise.Frequence +
									_Noise.Phase,
								Dimension * 1000 + Seed,
							);

							const MouseFactor =
								InfluenceMouse *
								(Math.min(1, MouseState().Velocity / 100) *
									MouseTransition);

							// biome-ignore lint/style/useDefaultSwitchClause:
							switch (Dimension) {
								case 0:
									MovementDimensional.X =
										Value * _Noise.Amplitude +
										dx * MouseFactor;

									break;

								case 1:
									MovementDimensional.Y =
										Value * _Noise.Amplitude +
										dy * MouseFactor;

									break;

								case 2:
									MovementDimensional.Rotation =
										Value * 360 * MouseFactor;

									break;

								case 3:
									MovementDimensional.Scale =
										1 + Value * 0.5 * MouseFactor;

									break;
							}
							return MovementDimensional;
						}, OffsetDimensional);
				}

				// Blend noise-driven rotation with any mouse-influenced rotation
				Angle =
					Lerp(
						Angle,
						Layer(TimeN + Seed, Column + Position) * Math.PI,
						SmoothingD * (1 - InfluenceMouse),
					) +
					OffsetDimensional.Rotation * InfluenceMouse;

				Radius =
					Lerp(
						Radius,
						((Layer(Row + Position, TimeN + Seed) + 1) / 2) *
							(AmplitudeB + Layer(NoiseTimeB, 10) * AmplitudeV) *
							Math.min((CurrentTime - TimeS) / 1000, 1) *
							(1 - InfluenceMouse),
						SmoothingD,
					) +
					Math.sqrt(
						OffsetDimensional.X * OffsetDimensional.X +
							OffsetDimensional.Y * OffsetDimensional.Y,
					) *
						InfluenceMouse;

				if (Element()) {
					const __Element = Element() as HTMLDivElement;

					// --- Rotation & Translation ---
					const Transform = `rotate(${Angle * (180 / Math.PI)}deg) translateX(${Radius}px)`;

					__Element.style.transform = MouseState().Active
						? `${Transform} translate(${OffsetDimensional.X}px, ${OffsetDimensional.Y}px) scale(${OffsetDimensional.Scale})`
						: Transform;

					// --- z-index ---
					__Element.style.zIndex = Math.floor(
						Lerp(
							Math.floor(
								((Layer(TimeN + Seed, Column + Position) + 1) /
									2) *
									10,
							),
							100,
							InfluenceMouse,
						),
					).toString();

					// --- Color Blending ---
					const Default = All[
						Math.floor(
							(Layer(TimeN + Seed, Column + Position) + 1) * 180,
						)
					] as string;

					const MouseColor = `hsl(${Lerp(
						((Layer(TimeN + Seed, Column + Position) + 1) / 2) *
							360,
						(MouseState().Velocity * 2) % 360,
						InfluenceMouse,
					)}, 100%, 50%)`;

					__Element.style.backgroundColor = MouseState().Active
						? MouseColor
						: Default;

					// --- Box-shadow ---
					__Element.style.boxShadow = `0 0 ${Lerp(
						((Layer(TimeN + Seed, Column + 50) + 1) / 2) * 10,
						InfluenceMouse * 20,
						InfluenceMouse,
					)}px ${MouseState().Active ? MouseColor : Default}`;

					// --- Opacity ---
					__Element.style.opacity = Lerp(
						((Layer(TimeN + Seed, Column + 150) + 1) / 2) * 0.3 +
							0.7,
						1,
						InfluenceMouse,
					).toString();

					// --- Transition Duration ---
					__Element.style.transitionDuration = `${(
						((Layer(TimeN + Seed, Column + 100) + 1) / 2) * 10 +
						5
					).toFixed(2)}s`;
				}

				ID = requestAnimationFrame(Move);
			};

			Move();

			onCleanup(() => {
				cancelAnimationFrame(ID);
			});
		});
	}

	return (
		<div
			ref={_Element}
			class={`Pixel h-${Font} w-${Font} ${Show ? "Color" : "bg-transparent"}`}
			style={
				Show
					? {
							"animation-delay": `${Delay}s`,
							transition: "all 0.3s ease-out",
						}
					: {}
			}
		/>
	);
};

export const Noise = createNoise2D();

export const Lerp = (a: number, b: number, t: number): number =>
	a + (b - a) * t;

export const Layer = (
	Time: number,
	Offset: number,
	Strength = 0.0001,
): number => Noise(Time + Offset, 20) + Strength * Noise(Time * 2 + Offset, 30);
