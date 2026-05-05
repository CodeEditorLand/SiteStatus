import { execSync } from "node:child_process";

import { defineConfig, envField } from "astro/config";

export const On = process.env["NODE_ENV"] === "development";

if (!process.env["CF_PAGES_COMMIT_SHA"]) {
	try {
		const currentHeadSha = execSync("git rev-parse HEAD").toString().trim();

		process.env["CF_PAGES_COMMIT_SHA"] = currentHeadSha;
	} catch (_Error) {}
}

if (!process.env["CACHE_VERSION_SHA"]) {
	let localCacheSha = "";

	try {
		localCacheSha = execSync("git rev-parse HEAD~1").toString().trim();

		console.log(
			`Astro Config (Dev): CACHE_VERSION_SHA not set, trying Git HEAD~1: ${localCacheSha}`,
		);
	} catch (_Error) {
		try {
			localCacheSha = execSync("git rev-parse HEAD").toString().trim();

			console.log(
				`Astro Config (Dev): CACHE_VERSION_SHA (HEAD~1 failed), using current Git HEAD: ${localCacheSha}`,
			);
		} catch (gitHeadError) {
			console.warn(
				"Astro Config (Dev): Failed to get any Git SHA for CACHE_VERSION_SHA. Will use schema default or be undefined.",
			);
		}
	}
	if (localCacheSha) {
		process.env["CACHE_VERSION_SHA"] = localCacheSha;
	}
}

export default defineConfig({
	env: {
		schema: {
			// Comma-separated list of GitHub PATs used by the token pool.
			// The pool round-robins across them, marking each dead (401) or
			// temporarily exhausted (403/429) as rate-limits are hit.
			// Falls back to unauthenticated (60 req/hr) when all are exhausted.
			// Example: "ghp_aaa111,ghp_bbb222,ghp_ccc333"
			TOKEN: envField.string({
				context: "server",
				access: "secret",
				optional: true,
				default: "",
			}),
			CF_PAGES_COMMIT_SHA: envField.string({
				context: "server",
				access: "secret",
				optional: true,
				default: "unknown-cf-sha",
			}),
			CACHE_VERSION_SHA: envField.string({
				context: "server",
				access: "public",
				optional: true,
				default: "unknown-cache-sha",
			}),
		},
		validateSecrets: true,
	},
	srcDir: "./Source",
	publicDir: "./Public",
	outDir: "./Target",
	site: On ? "http://localhost" : "https://Status.Code.Editor.Land",
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
		!On
			? {
					name: "Cache",
					hooks: {
						"astro:build:start": async (): Promise<void> => {
							// Glob both .json (legacy) and .jsonc (current) so
							// old files are evicted during the transition period.
							for (const File of await Glob("**/*.json{,c}", {
								cwd: join(process.cwd(), "Cache"),
								absolute: true,
								onlyFiles: true,
							})) {
								try {
									const raw = await readFile(File, {
										encoding: "utf-8",
									});

									// Strip // comments before parsing .jsonc files.
									const json = File.endsWith(".jsonc")
										? raw.replace(/^\s*\/\/.*$/gm, "")
										: raw;

									if (
										Date.now() -
											JSON.parse(json).TimeStamp >
										4 * 7 * 24 * 60 * 60 * 1000
									) {
										await unlink(File);
									}
								} catch (_Error) {
									await unlink(File);
								}
							}
						},
					},
				}
			: null,
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
		!On
			? (await import("@playform/compress")).default({ Logger: 1 })
			: null,
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
							preamble: "",
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
		optimizeDeps: {
			include: [
				"firebase/app",
				"firebase/analytics",
				"firebase/auth",
				"firebase/firestore",
				"jquery",
				"pdfmake/build/pdfmake",
				"pdfmake/build/vfs_fonts",
				"jszip",
			],
			// datatables.net and all its plugins are loaded as a vendored UMD
			// <script> tag at runtime (see Code.ts `?url` import). Pre-bundling
			// them pulls their CJS `require()` factory shim into the ESM browser
			// bundle, causing `require is not defined`. Exclude them entirely so
			// Vite never touches their CJS internals.
			exclude: [
				"datatables.net",
				"datatables.net-dt",
				"datatables.net-buttons-dt",
				"datatables.net-fixedcolumns-dt",
				"datatables.net-fixedheader-dt",
				"datatables.net-responsive-dt",
				"datatables.net-rowgroup-dt",
				"datatables.net-scroller-dt",
			],
		},
		ssr: {
			// firebase is client-only (dynamic import in Source/Script/Firebase.ts)
			// and must NOT be in noExternal — doing so bundles its CJS compat
			// shims into the browser output, causing `require is not defined`.
			// datatables.net, pdfmake, and jszip are also client-only and must
			// NOT be in noExternal for the same reason.
			noExternal: [],
		},
		resolve: {
			preserveSymlinks: false,
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
						Identifier.includes(".mjs") ||
						Identifier.includes(".js") ||
						Identifier.includes(".astro")
							? `crossorigin=\\\"anonymous\\\"`
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
});

export const { unlink, readFile } = await import("node:fs/promises");

export const { join } = await import("node:path");

export const { default: Glob } = await import("fast-glob");
