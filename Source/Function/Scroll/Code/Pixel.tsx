import type { PixelProps } from "@Function/Scroll/Type.js";
import { createSignal, onMount, type JSX, type Signal } from "solid-js";

export default ({
	Font,
	Character,
	Index: _,
	Show,
	Text,
	Mouse,
	Container,
	CurrentTime,
	Row,
	Column,
}: PixelProps): JSX.Element => {
	const [Element, _Element] =
		createSignal<HTMLDivElement>() as Signal<HTMLDivElement>;

	const Position = Character % Text;

	const Seed = Position * 0.1 + Row * 0.05 + Column * 0.02;

	onMount(() => {
		if (!(Show && Element() && Container)) {
			return;
		}

		new Style(Element(), {
			TimeNoise:
				Position * 0.1 +
				CurrentTime() *
					(Constant.MULTIPLIER_TIME_BASE +
						Noise(CurrentTime() * 0.001 + Seed, 30) *
							Constant.MULTIPLIER_TIME_VARIATION),
			Seed,
			Column,
			Position,
			Influence: 0,
			Offset: new Dimensional(CurrentTime(), Seed, Mouse(), 1).Calculate(
				1,
				1,
			),
			Mouse,
			Spectrum: ALL_COLORS,
		}).Roll();
	});

	return <div ref={_Element} class={`h-${Font} w-${Font}`} />;
};

// biome-ignore lint/nursery/useComponentExportOnlyModules:
export const { default: Dimensional } = await import(
	"@Function/Scroll/Code/Pixel/Dimensional.js"
);

// biome-ignore lint/nursery/useComponentExportOnlyModules:
export const { default: Style } = await import(
	"@Function/Scroll/Code/Pixel/Style.js"
);

// biome-ignore lint/nursery/useComponentExportOnlyModules:
export const { Influence, Layer, Noise, Spectrum } = await import(
	"@Function/Scroll/Code/Pixel/Animation.js"
);

// biome-ignore lint/nursery/useComponentExportOnlyModules:
export const { default: Constant } = await import(
	"@Function/Scroll/Code/Pixel/Animation/Constant.js"
);

// biome-ignore lint/nursery/useComponentExportOnlyModules:
export const ALL_COLORS = Spectrum(Constant.COLOR_STEPS);
