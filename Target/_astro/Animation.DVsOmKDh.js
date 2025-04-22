import { _ as t } from "./preload-helper.Cat91CNq.js";
import { _ as e } from "./Color.zZZKoFZe.js";
const a = (
		await t(async () => {
			const { createNoise2D: t } = await import(
				"./simplex-noise.DztDy58a.js"
			);
			return { createNoise2D: t };
		}, [])
	).createNoise2D(),
	o = (t) => {
		const e = [];
		for (const [a, o] of Object.entries(t))
			"string" == typeof o
				? e.push(o)
				: "object" == typeof o && e.push(...Object.values(o));
		return e;
	},
	r = (t, e, a) => t + (e - t) * a,
	s = (t, e, o = 1e-4) => a(t + e, 20) + o * a(2 * t + e, 30),
	n = (t) => {
		const a = o(e),
			r = a.length;
		return t >= r
			? a
			: Array.from({ length: t }, (e, o) => a[Math.floor((o * r) / t)]);
	},
	c = (t, e, a, o) =>
		Math.max(0, 1 - Math.sqrt(t * t + e * e) / i.RADIUS_EFFECT) *
		Math.max(0, 1 - (a - o.Last) / i.FADE_DURATION),
	{ default: i } = await t(async () => {
		const { default: t } = await import("./Constant.Ds8dDfZx.js");
		return { default: t };
	}, []);
export {
	i as Constant,
	o as Flatten,
	c as Influence,
	s as Layer,
	r as Lerp,
	a as Noise,
	n as Spectrum,
};
