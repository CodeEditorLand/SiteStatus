import { defineConfig, envField } from "astro/config";

export const On = process.env["NODE_ENV"] === "development";

export default (await import("astro/config")).defineConfig({
	env: {
		schema: {
			TOKEN_GITHUB_COMMIT_STATUS_EDITOR_LAND: envField.string({
				context: "server",
				access: "secret",
				optional: false,
				default: "GitHub Token API Stream",
			}),
		},
		validateSecrets: true,
	},
	srcDir: "./Source",
	publicDir: "./Public",
	outDir: "./Target",
	site: On ? "HTTP://localhost" : "HTTPS://Status.Editor.Land",
	compressHTML: !On,
	prefetch: {
		defaultStrategy: "hover",
		prefetchAll: true,
	},
	server: {
		port: 9999,
	},
	build: {
		concurrency: 9999,
	},
	integrations: [
		(await import("@astrojs/solid-js")).default({
			// @ts-ignore
			devtools: On,
		}),
		// @ts-ignore
		import.meta.env.MODE === "production"
			? (await import("astrojs-service-worker")).default()
			: null,
		(await import("@astrojs/sitemap")).default(),
		!On ? (await import("@playform/inline")).default({ Logger: 1 }) : null,
		!On ? (await import("@playform/format")).default({ Logger: 1 }) : null,
		!On
			? (await import("@playform/compress")).default({ Logger: 1 })
			: null,

		{
			name: "Cache",
			hooks: {
				"astro:build:start": async () => {
					console.log("Running cache cleanup before build...");

					await (async (
						// DAYS_PER_WEEK
						Age: number = 7 *
							// HOURS_PER_DAY
							24 *
							// MINUTES_PER_HOUR
							60 *
							// SECONDS_PER_MINUTE
							60 *
							// MILLISECONDS_PER_SECOND
							1000,
					) => {
						try {
							await Promise.all(
								await (
									await import("fast-glob")
								)
									.default("**/*.json", {
										cwd: join(process.cwd(), ".cache"),
										absolute: true,
									})
									.map(async (File) => {
										try {
											if (
												Date.now() -
													JSON.parse(
														await (
															await import(
																"fs/promises"
															)
														).readFile(File, {
															encoding: "utf-8",
														}),
													).TimeStamp >
												Age
											) {
												await unlink(File);
											}
										} catch (_Error) {
											console.log(
												`Cannot ${File}:`,
												_Error,
											);

											await unlink(File);
										}
									}),
							);
						} catch (_Error) {
							console.log("Cannot Cache:", _Error);
						}
					})(Age);
				},
			},
		},
	],
	experimental: {
		clientPrerender: true,
		contentIntellisense: true,
	},
	vite: {
		build: {
			sourcemap: On,
			manifest: true,
			minify: On ? false : "terser",
			cssMinify: On ? false : "esbuild",
			terserOptions: On
				? {
						compress: false,
						ecma: 2020,
						enclose: false,
						format: {
							ascii_only: false,
							braces: false,
							comments: false,
							ie8: false,
							indent_level: 4,
							indent_start: 0,
							inline_script: false,
							keep_numbers: true,
							keep_quoted_props: true,
							max_line_len: 80,
							preamble: null,
							ecma: 5,
							preserve_annotations: true,
							quote_keys: false,
							quote_style: 3,
							safari10: true,
							semicolons: true,
							shebang: false,
							shorthand: false,
							webkit: true,
							wrap_func_args: true,
							wrap_iife: true,
						},
						sourceMap: true,
						ie8: true,
						keep_classnames: true,
						keep_fnames: true,
						mangle: false,
						module: true,
						toplevel: true,
					}
				: {},
		},
		resolve: {
			preserveSymlinks: true,
		},
		css: {
			devSourcemap: On,
			transformer: "postcss",
		},
		plugins: [
			{
				name: "CrossOrigin",
				transform(Code, Identifier, _) {
					const CrossOrigin =
						Identifier.includes(".js") ||
						Identifier.includes(".astro")
							? `crossorigin=\\"anonymous\\"`
							: 'crossorigin="anonymous"';

					return Code.replace(/<script/g, `<script ${CrossOrigin}`)
						.replace(
							/<link[^>]*(?=.*rel="preload")(?=.*href="[^"]*\.js")(?=.*as="script")[^>]*/g,
							`$& ${CrossOrigin}`,
						)
						.replace(
							/<link[^>]*(?=.*rel="preload")(?=.*as="font")[^>]*/g,
							`$& ${CrossOrigin}`,
						)
						.replace(
							/<link[^>]*(?=.*rel="stylesheet")(?=.*href="https?:\/\/[^"]*")[^>]*/g,
							`$& ${CrossOrigin}`,
						);
				},
			},
		],
	},
}) as typeof defineConfig;

export const { unlink } = await import("fs/promises");
