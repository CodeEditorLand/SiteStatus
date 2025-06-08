const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f ||
		(m.f = [
			"_astro/Pixel.vuWQlbK6.js",
			"_astro/preload-helper.Cat91CNq.js",
			"_astro/web.CQfKIqCE.js",
			"_astro/solid.ChnxnTE8.js",
		]),
) => i.map((i) => d[i]);
import { _ as e } from "./preload-helper.Cat91CNq.js";
import { g as t, t as a, u as r, i as n } from "./web.CQfKIqCE.js";
import "./solid.ChnxnTE8.js";
var i = a(
		'<div class="Scroll w-full p-2"><p class=sr-only></p><div class="flex justify-center"aria-hidden=true>',
	),
	o = a("<div class=mr-2>"),
	s = a("<div class=Grid>"),
	l = a('<div class="Row flex">');
const c = ({ Text: e = "", Font: a = 1 }) => {
		const [c, _] = f({
				X: 0,
				Y: 0,
				XPrevious: 0,
				YPrevious: 0,
				Velocity: 0,
				Last: 0,
				Active: !1,
			}),
			[v, w] = f(),
			[C, g] = f(e.length),
			[x, E] = f(performance.now()),
			[h] = f(e);
		d(() => {
			let e;
			const t = (a) => {
				E(a), (e = requestAnimationFrame(t));
			};
			(e = requestAnimationFrame(t)), m(() => cancelAnimationFrame(e));
		});
		const j = () => h().slice(0, C());
		return (
			(A = t(i)),
			(y = A.firstChild),
			(P = y.nextSibling),
			r(w, A),
			n(y, h),
			n(P, () =>
				j()
					.split("")
					.map((e, r) => {
						return (
							(i = t(o)),
							n(i, () => {
								return (
									(i = e),
									(o = t(s)),
									n(o, () =>
										(p[i.toUpperCase()] || p[" "])?.map(
											(e, i) => {
												return (
													(o = t(l)),
													n(o, () =>
														e.map((e, t) =>
															u({
																Font: a,
																Character: r,
																Index: t,
																Show: e,
																Text: j()
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
													o
												);
												var o;
											},
										),
									),
									o
								);
								var i, o;
							}),
							i
						);
						var i;
					}),
			),
			A
		);
		var A, y, P;
	},
	{ default: u } = await e(
		async () => {
			const { default: e } = await import("./Pixel.vuWQlbK6.js");
			return { default: e };
		},
		__vite__mapDeps([0, 1, 2, 3]),
	),
	{ default: p } = await e(async () => {
		const { default: e } = await import("./Matrix.BYOAHmu9.js");
		return { default: e };
	}, []),
	{
		createEffect: d,
		createSignal: f,
		onCleanup: m,
		onMount: _,
	} = await e(async () => {
		const {
			createEffect: e,
			createSignal: t,
			onCleanup: a,
			onMount: r,
		} = await import("./solid.ChnxnTE8.js");
		return { createEffect: e, createSignal: t, onCleanup: a, onMount: r };
	}, []);
export { c as default };
