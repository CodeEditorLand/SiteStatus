import type { PARAMETER } from "@Function/Table/Layout/Request/Octokit.js";

export const { MIN_30 } = await import(
	"@Function/Table/Layout/Request/Get/TTL.js"
);

export default async (
	...[WHERE]: [PARAMETER[0]]
): Promise<
	| {
			Set: {
				// biome-ignore lint/suspicious/noExplicitAny:
				[key: string]: any;
			};
			TimeStamp: number;
	  }
	| undefined
> => {
	try {
		return JSON.parse(
			await (
				await import("node:fs/promises")
			).readFile(
				(await import("node:path")).join(
					process.cwd(),
					(await import("@Function/Table/Layout/Request/Set.js"))
						.DIRECTORY,
					`${encodeURIComponent(WHERE)}.json`,
				),
				"utf-8",
			),
		);
	} catch (_Error) {
		console.log(_Error);
	}

	return undefined;
};
