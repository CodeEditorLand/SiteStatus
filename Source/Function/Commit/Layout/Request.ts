import type { Parameter } from "@Function/Commit/Layout/Request/Octokit.js";

const { default: Get } = await import("@Function/Commit/Cache/Set/Get/Fn.js");

const { default: Set } = await import("@Function/Commit/Cache/Set/Fn.js");

export default async (...Parameter: Parameter) => {
	const Hash = (await import("crypto"))
		.createHash("md5")
		.update(JSON.stringify(Parameter))
		.digest("hex");

	const TTL = await (
		await import("@Function/Commit/Layout/Request/TTL.js")
	).default(Parameter);

	try {
		// TODO: If request fails, force timestamp override and use cache
		let Return =
			(await Get(`${Hash}`))?.Set ??
			(await (
				await import("@Function/Commit/Layout/Request/Octokit.js")
			).default(Parameter[0], Parameter[1]));

		await Set(`${Hash}`, Return);

		return Return;
	} catch (_Error) {
		console.log(_Error);

		return [];
	}
};
