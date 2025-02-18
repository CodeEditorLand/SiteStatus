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

	const [Element, _Element] = createSignal<HTMLDivElement>();

	const [Count, _Count] = createSignal(Text.length);

	const [CurrentTime, _CurrentTime] = createSignal(performance.now());

	const [_Text] = createSignal(Text);

	const Move = (e: MouseEvent): void => {
		const CurrentTime = performance.now();

		_Mouse((prev) => {
			const dx = e.clientX - prev.X;

			const dy = e.clientY - prev.Y;

			return {
				XPrevious: prev.X,

				YPrevious: prev.Y,

				X: e.clientX,

				Y: e.clientY,

				Velocity: Math.sqrt(dx * dx + dy * dy),

				Last: CurrentTime,

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
		});
	});

	createEffect(() => {
		let ID: number;

		const Scroll = (Time: number): void => {
			_CurrentTime(Time);

			ID = requestAnimationFrame(Scroll);
		};

		ID = requestAnimationFrame(Scroll);

		onCleanup(() => cancelAnimationFrame(ID));
	});

	const Display = (): string => {
		return _Text().slice(0, Count());
	};

	return (
		<div class="Scroll w-full p-2" ref={_Element}>
			<p class="sr-only">{_Text()}</p>
			<div class="flex justify-center" aria-hidden="true">
				{Display()
					.split("")
					.map((Visible, Character) => (
						<div class="mr-2">
							{((Position) => (
								<div class="Grid">
									{(
										Matrix[Position.toUpperCase()] ||
										Matrix[" "]
									)?.map((Row, RowIndex) => (
										<div class="Row flex">
											{Row.map((Show, Index) =>
												Pixel({
													Font,
													Character,
													Index,
													Show,
													Text: Display().length,
													Mouse,
													Container:
														Element()?.getBoundingClientRect() as DOMRect,
													CurrentTime,
													Row: RowIndex,
													Column: Index % 3,
												}),
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

export const { default: Pixel } = await import(
	"@Function/Scroll/Code/Pixel.js"
);

export const { default: Matrix } = await import("@Variable/Scroll/Matrix.js");

export const { createEffect, createSignal, onCleanup, onMount } = await import(
	"solid-js"
);
