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
	u = n("<div>"),
	f = n("<div class=flex>");
const d = ({ Text: e = "", Font: n = 1 }) => {
		const [d, w] = h(0),
			[g, _] = h(),
			[x, E] = h(10),
			[M] = h(e),
			j = () => M() + "   " + M() + "   ",
			y = () => M().length > x(),
			[A, L] = h(0);
		v(() => {
			const e = () => {
				g() &&
					E(Math.max(1, Math.floor((g()?.offsetWidth ?? 100) / 32)));
			};
			return (
				e(),
				window.addEventListener("resize", e),
				() => window.removeEventListener("resize", e)
			);
		}),
			p(() => {
				if (!y()) return;
				let e;
				const t = 4 * j().length,
					a = (r) => {
						r - A() >= 50 && (w((e) => (e - 0.2 + t) % t), L(r)),
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
			(S = F.nextSibling),
			a(_, b),
			r(F, M),
			r(S, () =>
				(() => {
					if (!y()) return M().slice(0, x());
					const e = Math.floor((((d() / 2) % j().length) * 4) / 4);
					return (
						j().slice(e, e + x()) +
						j().slice(0, Math.max(0, e + x() - j().length))
					);
				})()
					.split("")
					.map((e, a) => {
						return (
							(l = t(c)),
							r(l, () => {
								return (
									(l = e),
									(c = t(u)),
									r(c, () =>
										(m[l.toUpperCase()] || m[" "])?.map(
											(e, l) => {
												return (
													(c = t(f)),
													r(c, () =>
														e.map((e, c) => {
															return (
																(f = t(u)),
																r(f, () => {
																	return (
																		(r = e),
																		(f =
																			t(
																				u,
																			)),
																		s(
																			f,
																			`Pixel h-${n} w-${n} ${r ? "Color " + ((a + l + c) % 2 == 0 ? "Left" : "Right") : "bg-transparent"} `,
																		),
																		i((e) =>
																			o(
																				f,
																				r
																					? `animation-delay: ${0.1 * a + 0.05 * l + 0.02 * c}s;`
																					: "",
																				e,
																			),
																		),
																		f
																	);
																	var r, f;
																}),
																f
															);
															var f;
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
		var b, F, S;
	},
	{ default: m } = await e(async () => {
		const { default: e } = await import("./Matrix.BYOAHmu9.js");
		return { default: e };
	}, []),
	{
		createEffect: p,
		createSignal: h,
		onMount: v,
	} = await e(async () => {
		const {
			createEffect: e,
			createSignal: t,
			onMount: a,
		} = await import("./web.B203QFNt.js").then((e) => e.k);
		return { createEffect: e, createSignal: t, onMount: a };
	}, []);
export { d as default };
