const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f ||
		(m.f = [
			"_astro/Animation.DVsOmKDh.js",
			"_astro/preload-helper.Cat91CNq.js",
			"_astro/Color.zZZKoFZe.js",
		]),
) => i.map((i) => d[i]);
import { _ as e } from "./preload-helper.Cat91CNq.js";
class t {
	TimeCurrent;
	Seed;
	StateMouse;
	InfluenceMouse;
	constructor(e, t, a, s) {
		(this.TimeCurrent = e),
			(this.Seed = t),
			(this.StateMouse = a),
			(this.InfluenceMouse = s);
	}
	Calculate(e, t) {
		const {
				DIMENSION: r,
				AMPLITUDE_BASE: i,
				AMPLITUDE_VARIATION: n,
				MULTIPLIER_TIME_BASE: o,
				MULTIPLIER_TIME_VARIATION: c,
				COLOR_STEPS: u,
			} = a,
			I =
				this.InfluenceMouse *
				Math.min(1, this.StateMouse.Velocity / 100);
		return Array.from({ length: r }).reduce(
			(a, r, l) => (
				this.Apply(
					a,
					l,
					s(this.TimeCurrent * (o + l * c) + this.Seed, 1e3 * l),
					i + l * n,
					e,
					t,
					I,
					u,
				),
				a
			),
			{ X: 0, Y: 0, Rotation: 0, Scale: 1 },
		);
	}
	Apply(e, t, a, s, r, i, n, o) {
		switch (t) {
			case 0:
				e.X = a * s + r * n;
				break;
			case 1:
				e.Y = a * s + i * n;
				break;
			case 2:
				e.Rotation = a * o * n;
				break;
			case 3:
				e.Scale = 1 + 0.5 * a * n;
		}
	}
}
const { default: a } = await e(async () => {
		const { default: e } = await import("./Constant.Ds8dDfZx.js");
		return { default: e };
	}, []),
	{ Layer: s } = await e(
		async () => {
			const { Layer: e } = await import("./Animation.DVsOmKDh.js");
			return { Layer: e };
		},
		__vite__mapDeps([0, 1, 2]),
	);
export { a as Constant, s as Layer, t as default };
