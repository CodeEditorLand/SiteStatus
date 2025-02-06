import "@Function/Scroll/Stylesheet.css";

export default ({ Text = "", Font = 1 }: { Text?: string; Font?: number }) => {
	const [Offset, _Offset] = createSignal(0);

	const [Element, _Element] = createSignal<HTMLDivElement>();

	const [Count, _Count] = createSignal(10);

	const Width = 4;

	const [_Text] = createSignal(Text);

	const Padded = () => _Text() + "   " + _Text() + "   ";

	const Animate = () => _Text().length > Count();

	const [LastTimestamp, _LastTimestamp] = createSignal(0);

	const Time = 50;

	onMount(() => {
		const Factor = () => {
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

		return () => window.removeEventListener("resize", Factor);
	});

	createEffect(() => {
		if (!Animate()) return;

		let ID: number;

		const Size = Padded().length * Width;

		const Roll = (Current: number) => {
			const Past = Current - LastTimestamp();

			if (Past >= Time) {
				_Offset((prev) => (prev - 0.2 + Size) % Size);

				_LastTimestamp(Current);
			}

			ID = requestAnimationFrame(Roll);
		};

		ID = requestAnimationFrame(Roll);

		return () => cancelAnimationFrame(ID);
	});

	const Display = () => {
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
					.map((Visible, charIndex) => (
						<div class="mr-2">
							{((Position) => (
								<div>
									{(
										Matrix[Position.toUpperCase()] ||
										Matrix[" "]
									)?.map((Row, rowIndex) => (
										<div class="flex">
											{Row.map((Pixel, pixelIndex) => (
												<div>
													{((Show) => (
														<div
															class={`Pixel h-${Font} w-${Font} ${
																Show
																	? `Color ${
																			(charIndex +
																				rowIndex +
																				pixelIndex) %
																				2 ===
																			0
																				? "Left"
																				: "Right"
																		}`
																	: "bg-transparent"
															} `}
															style={
																Show
																	? `animation-delay: ${
																			charIndex *
																				0.1 +
																			rowIndex *
																				0.05 +
																			pixelIndex *
																				0.02
																		}s;`
																	: ""
															}
														/>
													))(Pixel)}
												</div>
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

export const { default: Matrix } = await import("@Variable/Scroll/Matrix.js");

export const { createEffect, createSignal, onMount } = await import("solid-js");
