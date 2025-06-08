const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f ||
		(m.f = [
			"_astro/Animation.Dww_N2iO.js",
			"_astro/preload-helper.Cat91CNq.js",
			"_astro/Color.BItzDmqo.js",
		]),
) => i.map((i) => d[i]);
import { _ as t } from "./preload-helper.Cat91CNq.js";
import { createEffect as s } from "./solid.Rql_8v_p.js";
class i {
	Element;
	TimeNoise;
	Seed;
	Column;
	Position;
	Influence;
	Offset;
	Mouse;
	Spectrum;
	constructor(t, s) {
		(this.Element = t),
			(this.TimeNoise = s.TimeNoise),
			(this.Seed = s.Seed),
			(this.Column = s.Column),
			(this.Position = s.Position),
			(this.Influence = s.Influence),
			(this.Offset = s.Offset),
			(this.Mouse = s.Mouse),
			(this.Spectrum = s.Spectrum);
	}
	Roll() {
		this.Transform(),
			this.ZIndex(),
			this.Color(),
			this.Shadow(),
			this.Opacity(),
			this.Transition();
	}
	Transform() {
		const t = `rotate(${(o(this.TimeNoise + this.Seed, this.Column + this.Position) * Math.PI + this.Offset.Rotation * this.Influence) * (180 / Math.PI)}deg) translateX(${this.Radius()}px)`;
		s(() => {
			this.Element.style.transform = this.Mouse().Active
				? `${t} translate(${this.Offset.X}px, ${this.Offset.Y}px) scale(${this.Offset.Scale})`
				: t;
		});
	}
	Radius() {
		return (
			((o(this.TimeNoise + this.Seed, this.Column + this.Position) + 1) /
				2) *
				(e.AMPLITUDE_BASE +
					o(this.TimeNoise, 10) * e.AMPLITUDE_VARIATION) *
				(1 - this.Influence) +
			Math.sqrt(
				this.Offset.X * this.Offset.X + this.Offset.Y * this.Offset.Y,
			) *
				this.Influence
		);
	}
	ZIndex() {
		this.Element.style.zIndex = Math.floor(
			h(
				Math.floor(
					((o(
						this.TimeNoise + this.Seed,
						this.Column + this.Position,
					) +
						1) /
						2) *
						10,
				),
				100,
				this.Influence,
			),
		).toString();
	}
	Color() {
		s(() => {
			this.Element.style.backgroundColor = this.Mouse().Active
				? `hsl(${h(((o(this.TimeNoise + this.Seed, this.Column + this.Position) + 1) / 2) * 360, (2 * this.Mouse().Velocity) % 360, this.Influence)}, 100%, 50%)`
				: this.Spectrum[
						Math.floor(
							180 *
								(o(
									this.TimeNoise + this.Seed,
									this.Column + this.Position,
								) +
									1),
						)
					];
		});
	}
	Shadow() {
		s(() => {
			const t = this.Mouse().Active
				? this.Element.style.backgroundColor
				: this.Spectrum[
						Math.floor(
							180 *
								(o(
									this.TimeNoise + this.Seed,
									this.Column + this.Position,
								) +
									1),
						)
					];
			this.Element.style.boxShadow = `0 0 ${h(((o(this.TimeNoise + this.Seed, this.Column + 50) + 1) / 2) * 10, 20 * this.Influence, this.Influence)}px ${t}`;
		});
	}
	Opacity() {
		this.Element.style.opacity = h(
			((o(this.TimeNoise + this.Seed, this.Column + 150) + 1) / 2) * 0.3 +
				0.7,
			1,
			this.Influence,
		).toString();
	}
	Transition() {
		this.Element.style.transitionDuration = `${(((o(this.TimeNoise + this.Seed, this.Column + 100) + 1) / 2) * 10 + 5).toFixed(2)}s`;
	}
}
const { default: e } = await t(async () => {
		const { default: t } = await import("./Constant.Ds8dDfZx.js");
		return { default: t };
	}, []),
	{ Layer: o, Lerp: h } = await t(
		async () => {
			const { Layer: t, Lerp: s } = await import(
				"./Animation.Dww_N2iO.js"
			);
			return { Layer: t, Lerp: s };
		},
		__vite__mapDeps([0, 1, 2]),
	);
export { e as Constant, o as Layer, h as Lerp, i as default };
