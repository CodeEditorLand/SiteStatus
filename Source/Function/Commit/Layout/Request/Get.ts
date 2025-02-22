import type { PARAMETER } from "@Function/Commit/Layout/Request/Octokit.js";

export const { MIN_30 } = await import(
	"@Function/Commit/Layout/Request/Get/TTL.js"
);

export default async (
	...[Where]: [PARAMETER[0]]
): Promise<
	| {
			Set: {
				[key: string]: {};
			};
			TimeStamp: number;
	  }
	| undefined
> => {
	try {
		return JSON.parse(
			await (
				await import("fs/promises")
			).readFile(
				(await import("path")).join(
					process.cwd(),
					(await import("@Function/Commit/Layout/Request/Set.js"))
						.DIRECTORY,
					encodeURIComponent(Where) + ".json",
				),
				"utf-8",
			),
		);
	} catch (_Error) {
		console.log(`Cannot ${Where}`, Where, _Error);
	}

	return undefined;
};
