import { readFile } from "node:fs/promises";

// biome-ignore lint/suspicious/noExplicitAny:
export default async (hash: string): Promise<undefined | any> => {
	try {
		const raw = await readFile(`Cache/Table/${hash}.jsonc`, {
			encoding: "utf-8",
		});

		// Strip single-line // comments (JSONC header) before parsing.
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
