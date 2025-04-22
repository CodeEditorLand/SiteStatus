const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f ||
		(m.f = [
			"_astro/Pixel.LlSrJoIj.js",
			"_astro/preload-helper.Cat91CNq.js",
			"_astro/web.d7l3FkaN.js",
		]),
) => i.map((i) => d[i]);
import { _ as e } from "./preload-helper.Cat91CNq.js";
import { g as t, t as a, u as n, i as r } from "./web.d7l3FkaN.js";
var i = a(
		'<div class="Scroll w-full p-2"><p class=sr-only></p><div class="flex justify-center"aria-hidden=true>',
	),
	s = a("<div class=mr-2>"),
	o = a("<div class=Grid>"),
	l = a('<div class="Row flex">');
const c = ({ Text: e = "", Font: a = 1 }) => {
		const [c, _] = m({
				X: 0,
				Y: 0,
				XPrevious: 0,
				YPrevious: 0,
				Velocity: 0,
				Last: 0,
				Active: !1,
			}),
			[v, w] = m(),
			[C, g] = m(e.length),
			[x, E] = m(performance.now()),
			[h] = m(e);
		p(() => {
			let e;
			const t = (a) => {
				E(a), (e = requestAnimationFrame(t));
			};
			(e = requestAnimationFrame(t)), d(() => cancelAnimationFrame(e));
		});
		const A = () => h().slice(0, C());
		return (
			(j = t(i)),
			(y = j.firstChild),
			(P = y.nextSibling),
			n(w, j),
			r(y, h),
			r(P, () =>
				A()
					.split("")
					.map((e, n) => {
						return (
							(i = t(s)),
							r(i, () => {
								return (
									(i = e),
									(s = t(o)),
									r(s, () =>
										(f[i.toUpperCase()] || f[" "])?.map(
											(e, i) => {
												return (
													(s = t(l)),
													r(s, () =>
														e.map((e, t) =>
															u({
																Font: a,
																Character: n,
																Index: t,
																Show: e,
																Text: A()
																	.length,
																Mouse: c,
																Container:
																	v()?.getBoundingClientRect(),
																CurrentTime: x,
																Row: i,
																Column: t % 3,
															}),
														),
													),
													s
												);
												var s;
											},
										),
									),
									s
								);
								var i, s;
							}),
							i
						);
						var i;
					}),
			),
			j
		);
		var j, y, P;
	},
	{ default: u } = await e(
		async () => {
			const { default: e } = await import("./Pixel.LlSrJoIj.js");
			return { default: e };
		},
		__vite__mapDeps([0, 1, 2]),
	),
	{ default: f } = await e(async () => {
		const { default: e } = await import("./Matrix.BYOAHmu9.js");
		return { default: e };
	}, []),
	{
		createEffect: p,
		createSignal: m,
		onCleanup: d,
		onMount: _,
	} = await e(async () => {
		const {
			createEffect: e,
			createSignal: t,
			onCleanup: a,
			onMount: n,
		} = await import("./web.d7l3FkaN.js").then((e) => e.s);
		return { createEffect: e, createSignal: t, onCleanup: a, onMount: n };
	}, []);
export { c as default };
