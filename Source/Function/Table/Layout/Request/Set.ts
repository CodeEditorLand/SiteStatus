export const DIRECTORY = "Cache/Table";

export default async (WHERE: string, Set: any): void => {
	const RETURN = Set ?? {};

	try {
		await (
			await import("fs/promises")
		).writeFile(
			(await import("path")).join(
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
	} catch (_Error) {}

	return RETURN;
};
