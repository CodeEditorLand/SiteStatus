import type { Parameter } from "@Function/Commit/Layout/Request/Octokit.js";

const { default: Get } = await import("@Function/Commit/Layout/Request/Get.js");

const { default: Set } = await import("@Function/Commit/Layout/Request/Set.js");

export default async (...Parameter: Parameter): Promise<any> => {
	const Hash = (await import("crypto"))
		.createHash("md5")
		.update(JSON.stringify(Parameter))
		.digest("hex");

	const TTL = await (
		await import("@Function/Commit/Layout/Request/Get/TTL.js")
	).default(Parameter);

	try {
		let Return =
			(await Get(`${Hash}`))?.Set ??
			(await (
				await import("@Function/Commit/Layout/Request/Octokit.js")
			).default(Parameter[0], Parameter[1])) ??
			(await Get(`${Hash}`, true))?.Set;

		await Set(`${Hash}`, Return);

		return Return;
	} catch (_Error) {
		console.log(_Error);

		return undefined;
	}
};
