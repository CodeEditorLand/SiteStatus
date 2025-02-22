export const { MIN_30 } = await import(
	"@Function/Commit/Layout/Request/Get/TTL.js"
);

export default async (
	Where: string,
	Force: boolean = false,
): Promise<
	| {
			Set: {
				[key: string]: {};
			};
	  }
	| undefined
> => {
	try {
		const _Set = JSON.parse(
			await (
				await import("fs/promises")
			).readFile(
				(await import("path")).join(
					process.cwd(),
					(await import("@Function/Commit/Layout/Request/Set.js"))
						.CACHE_DIRECTORY,
					encodeURIComponent(Where) + ".json",
				),
				"utf-8",
			),
		);

		if (Force || Date.now() - _Set.TimeStamp < MIN_30) {
			return _Set;
		}
	} catch (_Error) {
		console.log(`Cannot ${Where}`, Where, _Error);
	}

	return undefined;
};
