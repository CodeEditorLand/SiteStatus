import type { PARAMETER } from "@Function/Commit/Layout/Request/Octokit.js";

export const { default: Get } = await import(
	"@Function/Commit/Layout/Request/Get.js"
);

export type TRANSFORM = (Data: any) => Promise<any>;

export default async (
	...[REQUEST, OPTION, TRANSFORM]: [...PARAMETER, TRANSFORM?]
): Promise<any> => {
	let RETURN = undefined;

	const Hash = (await import("crypto"))
		.createHash("md5")
		.update(
			JSON.stringify(
				[REQUEST, OPTION, TRANSFORM ? TRANSFORM.toString() : ""],
				null,
				"\t",
			),
		)
		.digest("hex");

	try {
		let Cache = await Get(`${Hash}`);

		if (
			Cache?.Set &&
			Date.now() - Cache.TimeStamp <
				(
					await import("@Function/Commit/Layout/Request/Get/TTL.js")
				).default([REQUEST, OPTION])
		) {
			return Cache.Set;
		} else {
			RETURN = await (
				await import("@Function/Commit/Layout/Request/Octokit.js")
			).default(REQUEST, OPTION);

			if (TRANSFORM && typeof TRANSFORM === "function") {
				RETURN = await TRANSFORM(RETURN);
			}
		}

		if (RETURN === undefined) {
			RETURN = (await Get(`${Hash}`))?.Set;
		}

		return await (
			await import("@Function/Commit/Layout/Request/Set.js")
		).default(`${Hash}`, RETURN);
	} catch (_Error) {}

	return RETURN;
};
