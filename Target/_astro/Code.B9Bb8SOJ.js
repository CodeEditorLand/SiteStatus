import { _ as e } from "./preload-helper.D21cck6N.js";
import {
	g as t,
	u as a,
	i as r,
	t as n,
	c as s,
	a as i,
	s as o,
} from "./web.B203QFNt.js";
var l = n(
		'<div class="w-full overflow-hidden p-2"><p class=sr-only></p><div class="flex justify-center"aria-hidden=true>',
	),
	c = n("<div class=mr-2>"),
	f = n("<div class=Grid>"),
	u = n('<div class="Row flex">'),
	d = n("<div>");
const m = ({ Text: e = "", Font: n = 1 }) => {
		const [m, g] = v(0),
			[_, x] = v(),
			[E, M] = v(10),
			[$] = v(e),
			j = () => `${$()}   ${$()}   `,
			y = () => $().length > E(),
			[A, L] = v(0);
		w(() => {
			const e = () => {
				_() &&
					M(Math.max(1, Math.floor((_()?.offsetWidth ?? 100) / 32)));
			};
			return (
				e(),
				window.addEventListener("resize", e),
				() => window.removeEventListener("resize", e)
			);
		}),
			h(() => {
				if (!y()) return;
				let e;
				const t = 4 * j().length,
					a = (r) => {
						r - A() >= 50 && (g((e) => (e - 0.2 + t) % t), L(r)),
							(e = requestAnimationFrame(a));
					};
				return (
					(e = requestAnimationFrame(a)),
					() => cancelAnimationFrame(e)
				);
			});
		return (
			(b = t(l)),
			(F = b.firstChild),
			(R = F.nextSibling),
			a(x, b),
			r(F, $),
			r(R, () =>
				(() => {
					if (!y()) return $().slice(0, E());
					const e = Math.floor((((m() / 2) % j().length) * 4) / 4);
					return (
						j().slice(e, e + E()) +
						j().slice(0, Math.max(0, e + E() - j().length))
					);
				})()
					.split("")
					.map((e, a) => {
						return (
							(l = t(c)),
							r(l, () => {
								return (
									(l = e),
									(c = t(f)),
									r(c, () =>
										(p[l.toUpperCase()] || p[" "])?.map(
											(e, l) => {
												return (
													(c = t(u)),
													r(c, () =>
														e.map((e, r) => {
															return (
																(c = e),
																(f = t(d)),
																s(
																	f,
																	`Pixel h-${n} w-${n} ${c ? "Color " + ((a + l + r) % 2 == 0 ? "Left" : "Right") : "bg-transparent"} `,
																),
																i((e) =>
																	o(
																		f,
																		c
																			? `animation-delay: ${0.1 * a + 0.05 * l + 0.02 * r}s;`
																			: "",
																		e,
																	),
																),
																f
															);
															var c, f;
														}),
													),
													c
												);
												var c;
											},
										),
									),
									c
								);
								var l, c;
							}),
							l
						);
						var l;
					}),
			),
			b
		);
		var b, F, R;
	},
	{ default: p } = await e(async () => {
		const { default: e } = await import("./Matrix.BYOAHmu9.js");
		return { default: e };
	}, []),
	{
		createEffect: h,
		createSignal: v,
		onMount: w,
	} = await e(async () => {
		const {
			createEffect: e,
			createSignal: t,
			onMount: a,
		} = await import("./web.B203QFNt.js").then((e) => e.k);
		return { createEffect: e, createSignal: t, onMount: a };
	}, []);
export { m as default };
