import { type Mouse } from "@Function/Scroll/Type.js";
import { type JSX } from "solid-js";

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

	const [CurrentTime, _CurrentTime] = createSignal(performance.now());

	const Width = 4;

	const [_Text] = createSignal(Text);

	const Padded = (): string => `${_Text()}   ${_Text()}   `;

	// const Animate = (): boolean => _Text().length > Count();
	const Animate = (): boolean => false;

	const [LastTimestamp, _LastTimestamp] = createSignal(0);

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
		const _Element = Element();

		if (!_Element) {
			return;
		}

		_Element.addEventListener("mousemove", Move);

		_Element.addEventListener("mouseleave", () =>
			_Mouse((Previous) => ({ ...Previous, Active: false })),
		);

		const Factor = (): number =>
			_Count(
				Math.max(
					1,

					Math.floor((_Element.offsetWidth ?? 100) / 32),
				),
			);

		Factor();

		window.addEventListener("resize", Factor);

		onCleanup(() => {
			_Element.removeEventListener("mousemove", Move);

			_Element.removeEventListener("mouseleave", () =>
				_Mouse((Previous) => ({ ...Previous, Active: false })),
			);

			window.removeEventListener("resize", Factor);
		});
	});

	createEffect(() => {
		if (!Animate()) {
			return;
		}

		let ID: number;

		const Scroll = (Time: number): void => {
			_CurrentTime(Time);

			// Text scroll animation
			if (Animate()) {
				const Past = Time - LastTimestamp();

				if (Past >= Time) {
					_Offset(
						(prev) =>
							(prev - 0.2 + Padded().length * Width) %
							(Padded().length * Width),
					);

					_LastTimestamp(Time);
				}
			}

			ID = requestAnimationFrame(Scroll);
		};

		ID = requestAnimationFrame(Scroll);

		onCleanup(() => cancelAnimationFrame(ID));
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
									)?.map((Row, RowIndex) => (
										<div class="Row flex">
											{Row.map((Show, Index) => (
												<Pixel
													Font={Font}
													Character={IndexChar}
													Index={Index}
													Show={Show}
													Text={Display().length}
													Mouse={Mouse}
													Container={Element()?.getBoundingClientRect()}
													CurrentTime={CurrentTime}
													Row={RowIndex}
													Column={Index % 3}
												/>
											))}
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

export const { default: Pixel } = await import(
	"@Function/Scroll/Code/Pixel.js"
);

export const { default: Matrix } = await import("@Variable/Scroll/Matrix.js");

export const { createEffect, createSignal, onCleanup, onMount } = await import(
	"solid-js"
);
