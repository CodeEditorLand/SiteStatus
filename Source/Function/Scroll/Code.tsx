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

	createEffect((): void => {
		let ID: number;

		const Scroll = (Time: number): void => {
			_CurrentTime(Time);

			ID = requestAnimationFrame(Scroll);
		};

		ID = requestAnimationFrame(Scroll);

		onCleanup((): void => cancelAnimationFrame(ID));
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
					.map((Visible, Character): void => (
						<div class="mr-2">
							{((Position): void => (
								<div class="Grid">
									{(
										Matrix[Position.toUpperCase()] ||
										Matrix[" "]
									)?.map((Row, RowIndex): void => (
										<div class="Row flex">
											{Row.map((Show, Index): void =>
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
