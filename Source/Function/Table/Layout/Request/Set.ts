import { mkdir, writeFile } from "node:fs/promises";

export default async (
	hash: string,
	// biome-ignore lint/suspicious/noExplicitAny:
	Value: any,
	label: string,
): Promise<void> => {
	const content =
		`// CACHE: ${label}\n` +
		JSON.stringify({ Set: Value, TimeStamp: Date.now() }, null, "\t");

	try {
		await mkdir("Cache/Table", { recursive: true });

		await writeFile(`Cache/Table/${hash}.jsonc`, content, {
			encoding: "utf-8",
		});
	} catch (_Error) {}
};
