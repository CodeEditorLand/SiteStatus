import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

import type { PARAMETER } from "./Octokit.js";

export default async (
	[REQUEST, OPTION]: PARAMETER,
	// biome-ignore lint/suspicious/noExplicitAny:
	Value: any,
): Promise<void> => {
	const Key = createHash("md5")
		.update(JSON.stringify([REQUEST, OPTION]))
		.digest("hex");

	// Build a human-readable description from the request so the cache file
	// is self-documenting when opened in an editor.
	const label = [
		REQUEST,
		...Object.entries(OPTION as Record<string, unknown>)
			.filter(([, v]) => v !== undefined)
			.map(([k, v]) => `${k}=${v}`),
	].join(" | ");

	const content =
		`// CACHE: ${label}\n` +
		JSON.stringify({ Set: Value, TimeStamp: Date.now() }, null, "\t");

	try {
		await mkdir("Cache/Table", { recursive: true });

		await writeFile(`Cache/Table/${Key}.jsonc`, content, {
			encoding: "utf-8",
		});
	} catch (_Error) {}
};
