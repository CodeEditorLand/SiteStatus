export const DIRECTORY = "Cache/Commit";

export default async (Where: string, Set: any) => {
	const Return = Set ?? {};

	try {
		await (
			await import("fs/promises")
		).writeFile(
			(await import("path")).join(
				process.cwd(),
				DIRECTORY,
				encodeURIComponent(Where) + ".json",
			),
			JSON.stringify(
				{
					Set: Return,
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
		console.log("Error writing cache for key:", Where, _Error);
	}

	return Return;
};
