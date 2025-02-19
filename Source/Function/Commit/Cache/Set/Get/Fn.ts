export default async (Where: string) => {
	try {
		const _Set = JSON.parse(
			await (
				await import("fs/promises")
			).readFile(
				(await import("path")).join(
					process.cwd(),
					(await import("@Function/Commit/Cache/Set/Fn.js"))
						.CACHE_DIRECTORY,
					encodeURIComponent(Where) + ".json",
				),
				"utf-8",
			),
		);

		if (Date.now() - _Set.TimeStamp < 30 * 60 * 1000) {
			return _Set.Set;
		}
	} catch (_Error) {
		console.error(`Cannot ${Where}`, Where, _Error);
	}

	return undefined;
};
