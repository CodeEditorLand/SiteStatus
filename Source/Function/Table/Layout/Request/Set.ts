export const DIRECTORY = "Cache/Table";

export default async (WHERE: string, Set: any): Promise<any> => {
	// Early return if Set is undefined to prevent caching failed responses
	if (Set === undefined) {
		return undefined;
	}

	const RETURN = Set;

	try {
		await (
			await import("node:fs/promises")
		).writeFile(
			(await import("node:path")).join(
				process.cwd(),
				DIRECTORY,
				encodeURIComponent(WHERE) + ".json",
			),
			JSON.stringify(
				{
					Set: RETURN,
					TimeStamp: Date.now(),
				},
				null,
				"\t",
			),
			{
				encoding: "utf-8",
			},
		);
	} catch (_Error) {
		console.log(_Error);
	}

	return RETURN;
};
