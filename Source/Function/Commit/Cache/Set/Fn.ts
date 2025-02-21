export const CACHE_DIRECTORY = ".cache/Commit/Cache";

export default async (Where: string, Set: any) => {
	try {
		await (
			await import("fs/promises")
		).writeFile(
			(await import("path")).join(
				process.cwd(),
				CACHE_DIRECTORY,
				encodeURIComponent(Where) + ".json",
			),
			JSON.stringify(
				{
					Set,
					TimeStamp: Date.now(),
				},
				null,
				"\t",
			),
			"utf-8",
		);
	} catch (_Error) {
		console.log("Error writing cache for key:", Where, _Error);
	}
};
