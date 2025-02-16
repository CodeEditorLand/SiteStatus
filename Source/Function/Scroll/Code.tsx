import "@Function/Scroll/Stylesheet.scss";

import type { Mouse } from "@Function/Scroll/Code/Pixel.js";
import type { JSX } from "solid-js";

export default ({
	Text = "",

	Font = 1,
}: {
	Text?: string;

	Font?: number;
}): JSX.Element => {
	const [Mouse, _Mouse] = createSignal<Mouse>({
		X: 0,
		Y: 0,
		XPrevious: 0,
		YPrevious: 0,
		Velocity: 0,
		Last: 0,
		Active: false,
	});

	const [Offset, _Offset] = createSignal(0);

	const [Element, _Element] = createSignal<HTMLDivElement>();

	const [Count, _Count] = createSignal(10);

	const Width = 4;

	const [_Text] = createSignal(Text);

	const Padded = (): string => `${_Text()}   ${_Text()}   `;

	const Animate = (): boolean => _Text().length > Count();

	const [LastTimestamp, _LastTimestamp] = createSignal(0);

	const Time = 50;

	const Move = (e: MouseEvent): void => {
		const currentTime = performance.now();

		_Mouse((prev) => {
			const dx = e.clientX - prev.X;
			const dy = e.clientY - prev.Y;

			return {
				XPrevious: prev.X,
				YPrevious: prev.Y,
				X: e.clientX,
				Y: e.clientY,
				Velocity: Math.sqrt(dx * dx + dy * dy),
				Last: currentTime,
				Active: true,
			};
		});
	};

	onMount(() => {
		if (Element()) {
			Element()?.addEventListener("mousemove", Move);

			Element()?.addEventListener("mouseleave", () =>
				_Mouse((Previous) => ({ ...Previous, Active: false })),
			);
		}

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
		<div class="Scroll w-full p-2" ref={_Element}>
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
									)?.map((Row) => (
										<div class="Row flex">
											{Row.map((Show, IndexPixel) =>
												Pixel(
													Font,

													IndexChar,

													IndexPixel,

													Show,

													Display().length,

													Mouse,

													Element,
												),
											)}
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
