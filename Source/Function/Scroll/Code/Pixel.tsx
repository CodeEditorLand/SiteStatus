import { createNoise2D } from "simplex-noise";
import type { JSX } from "solid-js";

// TODO: Add z-index animations
export default (
	...[Font, Character, Pixel, Show, Text]: [
		number,
		number,
		number,
		number,
		number,
	]
): JSX.Element => {
	let Element: HTMLDivElement | undefined;

	const Position = Character % Text;

	const Column = Pixel % 3;

	const Row = Math.floor(Pixel / 3);

	const Delay = Position * 0.1 + (Row * 3 + Column) * 0.05;

	if (Show) {
		const Seed = Position * 0.1 + Row * 0.05 + Column * 0.02;

		let Angle = 0;

		let Radius = 0;

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
				const TimeC = performance.now();

				const NoiseTimeB = TimeC * 0.001 + Seed;

				const SmoothingD =
					SmoothingB + Noise(NoiseTimeB, 20) * SmoothingV;

				const TimeN =
					Position * 0.1 +
					TimeC *
						(MultiplierTimeB +
							Noise(NoiseTimeB, 30) * MultiplierTimeV);

				Angle +=
					(Noise(TimeN + Seed, Column + Position) * Math.PI - Angle) *
					SmoothingD;

				Radius +=
					(((Noise(Row + Position, TimeN + Seed) + 1) / 2) *
						(AmplitudeB + Noise(NoiseTimeB, 10) * AmplitudeV) *
						Math.min((TimeC - TimeS) / 1000, 1) -
						Radius) *
					SmoothingD;

				const Degree = Angle * (180 / Math.PI);

				if (Element) {
					Element.style.transform = `rotate(${Degree}deg) translateX(${Radius}px) rotate(${-Degree}deg)`;

					Element.style.transitionDuration = `${(((Noise(TimeN + Seed, Column + 100) + 1) / 2) * 10 + 5).toFixed(2)}s`;
				}

				ID = requestAnimationFrame(Move);
			};

			Move();

			onCleanup(() => cancelAnimationFrame(ID));
		});
	}

	return (
		<div
			ref={Element}
			class={`Pixel h-${Font} w-${Font} ${
				Show ? "Color" : "bg-transparent"
			}`}
			style={Show ? { "animation-delay": `${Delay}s` } : {}}
		/>
	);
};

export const { onMount, onCleanup } = await import("solid-js");

export const Noise = createNoise2D();
