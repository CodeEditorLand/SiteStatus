import { createNoise2D } from "simplex-noise";
import type { JSX } from "solid-js";

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

	// Calculate actual character position in the full text
	const Position =
		// (IndexChar + Math.floor(ScrollOffset)) % TextLength;
		Character % Text;

	// Calculate grid position (0-2 for columns, 0-4 for rows in 3x5 grid)
	const Column = Pixel % 3;
	const Row = Math.floor(Pixel / 3);

	// Compute the seed once for each pixel
	const Seed = Position * 0.1 + Row * 0.05 + Column * 0.02;

	const Delay = Position * 0.1 + (Row * 3 + Column) * 0.05;

	// We'll store the current polar coordinates for smooth interpolation.
	// in radians
	let Angle = 0;

	// in pixels
	let Radius = 0;

	// Base parameters and variances.
	// Base maximum radius.
	const AmplitudeB = 50;

	// Variance for amplitude.
	const AmplitudeV = 20;

	// Base smoothing factor.
	const SmoothingB = 0.05;

	// Variance for smoothing.
	const SmoothingV = 0.02;

	// Base factor for time.
	const MultiplierTimeB = 0.003;

	// Variance for time multiplier.
	const MultiplierTimeV = 0.002;

	// Ramp parameters: start at (0,0) and ramp to full movement.
	const TimeS = performance.now();

	if (Show) {
		onMount(() => {
			let ID: number;

			const Move = (): void => {
				const TimeC = performance.now();

				// Ramp factor goes from 0 to 1 over rampDuration.
				const Ramp = Math.min((TimeC - TimeS) / 1000, 1);

				// Use noise to get dynamic parameters.
				const NoiseTimeB = TimeC * 0.001 + Seed;

				const AmplitudeD =
					AmplitudeB + Noise(NoiseTimeB, 10) * AmplitudeV;

				const SmoothingD =
					SmoothingB + Noise(NoiseTimeB, 20) * SmoothingV;

				const MultiplierTime =
					MultiplierTimeB + Noise(NoiseTimeB, 30) * MultiplierTimeV;

				const TimeN = Position * 0.1 + TimeC * MultiplierTime;

				// Compute polar coordinates:
				// Angle: noise mapped from [-1, 1] to [-π, π].
				const AngleT = Noise(TimeN + Seed, Column + Position) * Math.PI;

				// Radius: noise normalized to [0,1] and then scaled.
				const RadiusN = (Noise(Row + Position, TimeN + Seed) + 1) / 2;

				const RadiusT = RadiusN * AmplitudeD * Ramp;

				// Smoothly interpolate the polar coordinates.
				Angle += (AngleT - Angle) * SmoothingD;

				Radius += (RadiusT - Radius) * SmoothingD;

				// Instead of converting to Cartesian coordinates, use CSS transforms that work in polar.
				// We convert the angle (in radians) to degrees.
				const Degree = Angle * (180 / Math.PI);

				if (Element) {
					Element.style.transform = `rotate(${Degree}deg) translateX(${Radius}px) rotate(${-Degree}deg)`;
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
				Show
					? `Color ${
							(Position + Row + Column) % 2 === 0 ? "Left" : "Right"
						}`
					: "bg-transparent"
			}`}
			style={{ "animation-delay": `${Delay}s` }}
		/>
	);
};

export const { onMount, onCleanup } = await import("solid-js");

export const Noise = createNoise2D();
