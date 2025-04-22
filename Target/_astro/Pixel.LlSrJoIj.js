const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f ||
		(m.f = [
			"_astro/Dimensional.DB1cWw7q.js",
			"_astro/preload-helper.Cat91CNq.js",
			"_astro/Style.BCC0yVY-.js",
			"_astro/web.d7l3FkaN.js",
			"_astro/Animation.DVsOmKDh.js",
			"_astro/Color.zZZKoFZe.js",
		]),
) => i.map((i) => d[i]);
import { _ as e } from "./preload-helper.Cat91CNq.js";
import {
	d as a,
	o as t,
	g as n,
	u as o,
	f as r,
	t as s,
} from "./web.d7l3FkaN.js";
var u = s("<div>");
const i = ({
		Font: e,
		Character: s,
		Index: i,
		Show: c,
		Text: f,
		Mouse: I,
		Container: E,
		CurrentTime: p,
		Row: T,
		Column: L,
	}) => {
		const [R, S] = a(),
			y = s % f,
			A = 0.1 * y + 0.05 * T + 0.02 * L;
		return (
			t(() => {
				c &&
					R() &&
					E &&
					new l(R(), {
						TimeNoise:
							0.1 * y +
							p() *
								(d.MULTIPLIER_TIME_BASE +
									m(0.001 * p() + A, 30) *
										d.MULTIPLIER_TIME_VARIATION),
						Seed: A,
						Column: L,
						Position: y,
						Influence: 0,
						Offset: new _(p(), A, I(), 1).Calculate(1, 1),
						Mouse: I,
						Spectrum: w,
					}).Roll();
			}),
			(C = n(u)),
			o(S, C),
			r(C, `h-${e} w-${e}`),
			C
		);
		var C;
	},
	{ default: _ } = await e(
		async () => {
			const { default: e } = await import("./Dimensional.DB1cWw7q.js");
			return { default: e };
		},
		__vite__mapDeps([0, 1]),
	),
	{ default: l } = await e(
		async () => {
			const { default: e } = await import("./Style.BCC0yVY-.js");
			return { default: e };
		},
		__vite__mapDeps([2, 1, 3]),
	),
	{
		Influence: c,
		Layer: f,
		Noise: m,
		Spectrum: I,
	} = await e(
		async () => {
			const {
				Influence: e,
				Layer: a,
				Noise: t,
				Spectrum: n,
			} = await import("./Animation.DVsOmKDh.js");
			return { Influence: e, Layer: a, Noise: t, Spectrum: n };
		},
		__vite__mapDeps([4, 1, 5]),
	),
	{ default: d } = await e(async () => {
		const { default: e } = await import("./Constant.Ds8dDfZx.js");
		return { default: e };
	}, []),
	w = I(d.COLOR_STEPS);
export {
	w as ALL_COLORS,
	d as Constant,
	_ as Dimensional,
	c as Influence,
	f as Layer,
	m as Noise,
	I as Spectrum,
	l as Style,
	i as default,
};
