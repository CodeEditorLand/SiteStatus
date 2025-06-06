const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f ||
		(m.f = [
			"_astro/Dimensional.neCJUjvD.js",
			"_astro/preload-helper.Cat91CNq.js",
			"_astro/Style.CoISvF-A.js",
			"_astro/solid.ChnxnTE8.js",
			"_astro/Animation.Dww_N2iO.js",
			"_astro/Color.BItzDmqo.js",
		]),
) => i.map((i) => d[i]);
import { _ as e } from "./preload-helper.Cat91CNq.js";
import { g as t, u as a, c as n, t as o } from "./web.CQfKIqCE.js";
import { createSignal as r, onMount as s } from "./solid.ChnxnTE8.js";
var i = o("<div>");
const u = ({
		Font: e,
		Character: o,
		Index: u,
		Show: c,
		Text: m,
		Mouse: I,
		Container: w,
		CurrentTime: E,
		Row: T,
		Column: L,
	}) => {
		const [R, S] = r(),
			j = o % m,
			y = 0.1 * j + 0.05 * T + 0.02 * L;
		return (
			s(() => {
				c &&
					R() &&
					w &&
					new l(R(), {
						TimeNoise:
							0.1 * j +
							E() *
								(d.MULTIPLIER_TIME_BASE +
									f(0.001 * E() + y, 30) *
										d.MULTIPLIER_TIME_VARIATION),
						Seed: y,
						Column: L,
						Position: j,
						Influence: 0,
						Offset: new _(E(), y, I(), 1).Calculate(1, 1),
						Mouse: I,
						Spectrum: p,
					}).Roll();
			}),
			(A = t(i)),
			a(S, A),
			n(A, `h-${e} w-${e}`),
			A
		);
		var A;
	},
	{ default: _ } = await e(
		async () => {
			const { default: e } = await import("./Dimensional.neCJUjvD.js");
			return { default: e };
		},
		__vite__mapDeps([0, 1]),
	),
	{ default: l } = await e(
		async () => {
			const { default: e } = await import("./Style.CoISvF-A.js");
			return { default: e };
		},
		__vite__mapDeps([2, 1, 3]),
	),
	{
		Influence: c,
		Layer: m,
		Noise: f,
		Spectrum: I,
	} = await e(
		async () => {
			const {
				Influence: e,
				Layer: t,
				Noise: a,
				Spectrum: n,
			} = await import("./Animation.Dww_N2iO.js");
			return { Influence: e, Layer: t, Noise: a, Spectrum: n };
		},
		__vite__mapDeps([4, 1, 5]),
	),
	{ default: d } = await e(async () => {
		const { default: e } = await import("./Constant.Ds8dDfZx.js");
		return { default: e };
	}, []),
	p = I(d.COLOR_STEPS);
export {
	p as ALL_COLORS,
	d as Constant,
	_ as Dimensional,
	c as Influence,
	m as Layer,
	f as Noise,
	I as Spectrum,
	l as Style,
	u as default,
};
