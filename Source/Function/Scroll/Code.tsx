import "@Function/Scroll/Stylesheet.scss";

import type { JSX } from "solid-js";

export default ({
	Text = "",

	Font = 1,
}: {
	Text?: string;

	Font?: number;
}): JSX.Element => {
	const [Offset, _Offset] = createSignal(0);

	const [Element, _Element] = createSignal<HTMLDivElement>();

	const [Count, _Count] = createSignal(10);

	const Width = 4;

	const [_Text] = createSignal(Text);

	const Padded = (): string => `${_Text()}   ${_Text()}   `;

	const Animate = (): boolean => _Text().length > Count();

	const [LastTimestamp, _LastTimestamp] = createSignal(0);

	const Time = 50;

	onMount(() => {
		const Factor = (): void => {
			if (Element()) {
				_Count(
					Math.max(
						1,

						Math.floor((Element()?.offsetWidth ?? 100) / 32),
					),
				);
			}
		};

		Factor();

		window.addEventListener("resize", Factor);

		return (): void => window.removeEventListener("resize", Factor);
	});

	createEffect(() => {
		if (!Animate()) {
			return;
		}

		let ID: number;

		const Size = Padded().length * Width;

		const Roll = (Current: number): void => {
			const Past = Current - LastTimestamp();

			if (Past >= Time) {
				_Offset((prev) => (prev - 0.2 + Size) % Size);

				_LastTimestamp(Current);
			}

			ID = requestAnimationFrame(Roll);
		};

		ID = requestAnimationFrame(Roll);

		return (): void => cancelAnimationFrame(ID);
	});

	const Display = (): string => {
		if (!Animate()) {
			return _Text().slice(0, Count());
		}

		const Start = Math.floor(
			(((Offset() / 2) % Padded().length) * Width) / Width,
		);

		return (
			Padded().slice(Start, Start + Count()) +
			Padded().slice(0, Math.max(0, Start + Count() - Padded().length))
		);
	};

	return (
		<div class="w-full overflow-hidden p-2" ref={_Element}>
			<p class="sr-only">{_Text()}</p>
			<div class="flex justify-center" aria-hidden="true">
				{Display()
					.split("")
					.map((Visible, IndexChar) => (
						<div class="mr-2">
							{((Position) => (
								<div class="Grid">
									{(
										Matrix[Position.toUpperCase()] ||
										Matrix[" "]
									)?.map((Row, IndexRow) => (
										<div class="Row flex">
											{Row.map((Show, IndexPixel) => {
												return Pixel(
													Font,

													IndexChar,

													IndexRow,

													IndexPixel,

													Show,
												);
											})}
										</div>
									))}
								</div>
							))(Visible)}
						</div>
					))}
			</div>
		</div>
	);
};

export const { default: Matrix } = await import("@Variable/Scroll/Matrix.js");

export const { createEffect, createSignal, onMount, onCleanup } = await import(
	"solid-js"
);

export const { default: Pixel } = await import(
	"@Function/Scroll/Code/Pixel.js"
);
