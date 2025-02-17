import type { PixelProps } from "@Function/Scroll/Type.js";
import { createEffect, createSignal, type JSX } from "solid-js";

export default function Pixel({
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
}: PixelProps): JSX.Element {
	const [Element, _Element] = createSignal<HTMLDivElement>();

	const Position = Character % Text;

	createEffect(() => {
		if (!(Show && Element() && Container)) {
			return;
		}

		const _Element = Element();

		if (!_Element) {
			return;
		}

		const Seed = Position * 0.1 + Row * 0.05 + Column * 0.02;

		// if (Mouse().Active) {
		const dx = Mouse().X - (Container.left + Column * Font);

		const dy = Mouse().Y - (Container.top + Row * Font);

		const _Influence = Influence(dx, dy, CurrentTime(), Mouse());

		new Style(_Element, {
			TimeNow:
				Position * 0.1 +
				CurrentTime() *
					(Constant.MULTIPLIER_TIME_BASE +
						Noise(CurrentTime() * 0.001 + Seed, 30) *
							Constant.MULTIPLIER_TIME_VARIATION),
			Seed,
			Column,
			Position,
			Influence: _Influence,
			Offset: new Dimensional(
				CurrentTime(),
				Seed,
				Mouse(),
				_Influence,
			).calculate(dx, dy),
			Mouse: Mouse(),
			Spectrum: ALL_COLORS,
		}).Roll();
		// }
	});

	return <div ref={_Element} class={`h-${Font} w-${Font}`} />;
}

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
