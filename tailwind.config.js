import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./Public/**/*.html",
		"./Source/**/*.{astro,js,jsx,ts,tsx,vue,svelte}",
	],

	darkMode: "media",

	theme: {
		container: {
			center: true,
		},
		extend: {
			transitionTimingFunction: {
				Ease: "cubic-bezier(0.21, 0.1, 0.21, 1)",
			},
			fontFamily: {
				sans: ["Albert Sans", ...fontFamily.sans],
				Hack: ["Hack", ...fontFamily.mono],
			},
			typography: {
				DEFAULT: {
					css: {
						a: {
							"font-weight": "400",
						},
					},
				},
			},
			colors: {
				backgroundLight: "var(--background-light)",
				backgroundDark: "var(--background-dark)",
			},
		},
	},

	variants: {},

	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
	],

	// TODO: Link that to the dynamic components inside ./Source/Function/Scroll/Layout.astro
	safelist: ["h-2", "w-2"],
};
