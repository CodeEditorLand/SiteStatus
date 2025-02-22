import { _ as t } from "./preload-helper.D21cck6N.js";
const a = (
		await t(async () => {
			const { createNoise2D: t } = await import(
				"./simplex-noise.DztDy58a.js"
			);
			return { createNoise2D: t };
		}, [])
	).createNoise2D(),
	e = (t, a, e) => t + (a - t) * e,
	r = (t, e, r = 1e-4) => a(t + e, 20) + r * a(2 * t + e, 30),
	s = (t) =>
		Array.from({ length: t }, (a, e) => `hsl(${(e / t) * 360}, 100%, 50%)`),
	o = (t, a, e, r) =>
		Math.max(0, 1 - Math.sqrt(t * t + a * a) / i.RADIUS_EFFECT) *
		Math.max(0, 1 - (e - r.Last) / i.FADE_DURATION),
	{ default: i } = await t(async () => {
		const { default: t } = await import("./Constant.Ds8dDfZx.js");
		return { default: t };
	}, []);
export {
	i as Constant,
	o as Influence,
	r as Layer,
	e as Lerp,
	a as Noise,
	s as Spectrum,
};
