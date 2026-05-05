import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import type { PARAMETER } from "./Octokit.js";

// biome-ignore lint/suspicious/noExplicitAny:
export default async ([REQUEST, OPTION]: PARAMETER): Promise<undefined | any> => {
	const Key = createHash("md5")
		.update(JSON.stringify([REQUEST, OPTION]))
		.digest("hex");

	try {
		const raw = await readFile(`Cache/Table/${Key}.jsonc`, {
			encoding: "utf-8",
		});

		// Strip single-line comments before parsing (JSONC → JSON).
		const json = raw.replace(/^\s*\/\/.*$/gm, "");

		// biome-ignore lint/suspicious/noExplicitAny:
		const { Set: Value, TimeStamp }: { Set: any; TimeStamp: number } =
			JSON.parse(json);

		if (Date.now() - TimeStamp > 4 * 7 * 24 * 60 * 60 * 1000) {
			return undefined;
		}

		return Value;
	} catch (_Error) {
		return undefined;
	}
};

export { Key } from "./Get/Key.js";
