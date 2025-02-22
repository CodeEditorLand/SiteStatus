import type { PARAMETER } from "@Function/Commit/Layout/Request/Octokit.js";

export const { default: Get } = await import(
	"@Function/Commit/Layout/Request/Get.js"
);

export type TRANSFORM = (Data: any) => Promise<any>;

export default async (
	...[REQUEST, OPTION, TRANSFORM]: [...PARAMETER, TRANSFORM?]
): Promise<any> => {
	const Hash = (await import("crypto"))
		.createHash("md5")
		.update(
			JSON.stringify([
				REQUEST,
				OPTION,
				TRANSFORM ? TRANSFORM.toString() : "",
			]),
		)
		.digest("hex");

	try {
		let Request = undefined;

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
			Request = await (
				await import("@Function/Commit/Layout/Request/Octokit.js")
			).default(REQUEST, OPTION);

			if (TRANSFORM && typeof TRANSFORM === "function") {
				Request = await TRANSFORM(Request);
			}
		}

		if (Request === undefined) {
			Request = (await Get(`${Hash}`))?.Set;
		}

		return await (
			await import("@Function/Commit/Layout/Request/Set.js")
		).default(`${Hash}`, Request);
	} catch (_Error) {
		console.error(_Error);

		return undefined;
	}
};
